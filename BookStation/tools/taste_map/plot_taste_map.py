"""
Taste map: UMAP 2D plot — books, user taste star, and optional taste trajectory from snapshots.
"""

import argparse
import json
from typing import Dict, List, Optional

import numpy as np
import plotly.colors as pc
import plotly.graph_objects as go
from scipy.spatial import ConvexHull
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
from umap import UMAP

# ---------------------------------------------------------------------------
# Color helpers
# ---------------------------------------------------------------------------
_PALETTE = (
    pc.qualitative.Bold
    + pc.qualitative.Dark24
    + pc.qualitative.Plotly
    + pc.qualitative.Light24
)


def build_color_map(labels: List[str]) -> Dict[str, str]:
    unique = sorted(set(labels))
    return {g: _PALETTE[i % len(_PALETTE)] for i, g in enumerate(unique)}


def hex_to_rgba(hex_color: str, alpha: float) -> str:
    h = hex_color.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"rgba({r},{g},{b},{alpha})"


# ---------------------------------------------------------------------------
# Convex-hull region traces
# ---------------------------------------------------------------------------
def convex_hull_traces(
    points: np.ndarray,
    color: str,
    label: str,
    fill_alpha: float = 0.13,
    line_alpha: float = 0.35,
) -> List[go.Scatter]:
    if len(points) < 3:
        return []
    try:
        hull = ConvexHull(points)
        v = hull.vertices
        xs = np.append(points[v, 0], points[v[0], 0])
        ys = np.append(points[v, 1], points[v[0], 1])
        return [
            go.Scatter(
                x=xs,
                y=ys,
                fill="toself",
                fillcolor=hex_to_rgba(color, fill_alpha),
                line=dict(color=hex_to_rgba(color, line_alpha), width=1.5, dash="dot"),
                mode="lines",
                legendgroup=label,
                showlegend=False,
                hoverinfo="skip",
                name=f"_{label}_region",
            )
        ]
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------
def load_payload(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def normalize_rows(arr: np.ndarray) -> np.ndarray:
    return normalize(arr, norm="l2", axis=1)


def stack_optional(*arrays: Optional[np.ndarray]) -> np.ndarray:
    return np.vstack([a for a in arrays if a is not None])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", required=True, help="Path to taste_map_export.json")
    ap.add_argument("--out", default="taste_map.html", help="Output HTML path")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument(
        "--color-by",
        choices=("cluster", "none"),
        default="cluster",
    )
    args = ap.parse_args()

    data = load_payload(args.json)
    books = data["books"]
    if not books:
        raise SystemExit("No books in export")

    book_rows: List[dict] = []
    raw_mats: List[np.ndarray] = []
    for b in books:
        emb = b.get("embedding")
        if emb is None:
            continue
        raw_mats.append(np.asarray(emb, dtype=np.float64))
        book_rows.append(b)

    if not raw_mats:
        raise SystemExit("No book embeddings found")

    x_books = np.vstack(raw_mats)
    n_books = x_books.shape[0]

    k = min(8, max(1, n_books))
    x_norm = normalize_rows(x_books)
    cluster_ids = KMeans(n_clusters=k, random_state=args.seed, n_init=10).fit_predict(x_norm)
    cluster_labels = [f"Cluster {int(c) + 1}" for c in cluster_ids]

    snapshots = data.get("userSnapshots") or []
    snap_mat: Optional[np.ndarray] = None
    if snapshots:
        snap_mat = normalize_rows(
            np.vstack([np.asarray(s["tasteProfile"], dtype=np.float64) for s in snapshots])
        )

    user_vec: Optional[np.ndarray] = None
    if data.get("user") and data["user"].get("tasteProfile") is not None:
        user_vec = normalize_rows(
            np.asarray(data["user"]["tasteProfile"], dtype=np.float64).reshape(1, -1)
        )

    if args.color_by == "cluster":
        group_labels = cluster_labels
    else:
        group_labels = ["Books"] * n_books

    cmap = build_color_map(group_labels)

    # UMAP: books + snapshots + user only
    all_emb = stack_optional(x_norm, snap_mat, user_vec)
    n_total = len(all_emb)

    reducer = UMAP(
        n_components=2,
        random_state=args.seed,
        metric="cosine",
        n_neighbors=min(7, max(2, n_total - 1)),
        min_dist=0.1,
        spread=1.5,
    )

    proj = reducer.fit_transform(all_emb)

    n_s = snap_mat.shape[0] if snap_mat is not None else 0
    n_u = 1 if user_vec is not None else 0

    idx = 0
    book_xy = proj[idx : idx + n_books]
    idx += n_books
    snap_xy = proj[idx : idx + n_s] if n_s else None
    idx += n_s
    user_xy = proj[idx : idx + n_u] if n_u else None

    fig = go.Figure()

    if args.color_by != "none":
        groups: Dict[str, List[int]] = {}
        for i, gl in enumerate(group_labels):
            groups.setdefault(gl, []).append(i)

        for gl, idxs in groups.items():
            pts = book_xy[np.array(idxs)]
            for trace in convex_hull_traces(pts, cmap[gl], gl):
                fig.add_trace(trace)

    groups_for_scatter: Dict[str, List[int]] = {}
    for i, gl in enumerate(group_labels):
        groups_for_scatter.setdefault(gl, []).append(i)

    for gl, idxs in groups_for_scatter.items():
        idxs_arr = np.array(idxs)
        pts = book_xy[idxs_arr]
        color = cmap[gl]
        names = [book_rows[i]["name"] for i in idxs]
        clust_info = [cluster_labels[i] for i in idxs]
        hover_extra = [f"{c}" for c in clust_info]

        fig.add_trace(
            go.Scatter(
                x=pts[:, 0],
                y=pts[:, 1],
                mode="markers",
                marker=dict(
                    size=9,
                    color=color,
                    opacity=0.88,
                    line=dict(width=0.8, color="rgba(255,255,255,0.7)"),
                ),
                text=names,
                customdata=hover_extra,
                hovertemplate=(
                    "<b>%{text}</b><br>"
                    "%{customdata}<br>"
                    "(%{x:.2f}, %{y:.2f})"
                    "<extra></extra>"
                ),
                name=gl,
                legendgroup=gl,
            )
        )

    if snap_xy is not None and len(snap_xy) > 1:
        n_s_actual = len(snap_xy)
        fig.add_trace(
            go.Scatter(
                x=snap_xy[:, 0],
                y=snap_xy[:, 1],
                mode="lines+markers",
                line=dict(width=2.5, color="rgba(79, 70, 229, 0.65)"),
                marker=dict(
                    size=9,
                    color=list(range(n_s_actual)),
                    colorscale=[[0, "rgba(79,70,229,0.25)"], [1, "rgba(79,70,229,0.9)"]],
                    showscale=False,
                    line=dict(width=1, color="white"),
                ),
                name="Taste history",
                hovertemplate="Snapshot<br>(%{x:.2f}, %{y:.2f})<extra></extra>",
            )
        )
    elif snap_xy is not None and len(snap_xy) == 1:
        fig.add_trace(
            go.Scatter(
                x=[snap_xy[0, 0]],
                y=[snap_xy[0, 1]],
                mode="markers",
                marker=dict(size=13, color="rgba(79,70,229,0.85)", line=dict(width=1.5, color="white")),
                name="Taste snapshot",
            )
        )

    if snap_xy is not None and user_xy is not None and len(snap_xy) > 0:
        fig.add_trace(
            go.Scatter(
                x=[snap_xy[-1, 0], user_xy[0, 0]],
                y=[snap_xy[-1, 1], user_xy[0, 1]],
                mode="lines",
                line=dict(width=2, dash="dash", color="rgba(251, 146, 60, 0.75)"),
                name="→ Current taste",
                hoverinfo="skip",
            )
        )

    if user_xy is not None:
        fig.add_trace(
            go.Scatter(
                x=[user_xy[0, 0]],
                y=[user_xy[0, 1]],
                mode="markers",
                marker=dict(
                    size=40,
                    symbol="circle",
                    color="rgba(251, 146, 60, 0.18)",
                    line=dict(width=0),
                ),
                showlegend=False,
                hoverinfo="skip",
                name="_user_glow",
            )
        )
        fig.add_trace(
            go.Scatter(
                x=[user_xy[0, 0]],
                y=[user_xy[0, 1]],
                mode="markers+text",
                marker=dict(
                    size=26,
                    symbol="star",
                    color="#F97316",
                    line=dict(width=2.5, color="white"),
                    opacity=1.0,
                ),
                text=["  You"],
                textposition="middle right",
                textfont=dict(size=15, color="#EA580C", family="Arial Black"),
                hovertemplate="<b>Your current taste</b><br>(%{x:.2f}, %{y:.2f})<extra></extra>",
                name="Your Taste ★",
            )
        )
        fig.add_annotation(
            x=user_xy[0, 0],
            y=user_xy[0, 1],
            text="<b>You are here</b>",
            showarrow=True,
            arrowhead=2,
            arrowsize=1.4,
            arrowwidth=2.2,
            arrowcolor="#EA580C",
            font=dict(size=13, color="#EA580C", family="Arial"),
            bgcolor="rgba(255,255,255,0.85)",
            bordercolor="#F97316",
            borderwidth=1.5,
            borderpad=5,
            ax=55,
            ay=-55,
        )

    color_mode = args.color_by
    subtitle_parts = [f"{n_books} books", f"colored by {color_mode}"]
    if snap_mat is not None:
        subtitle_parts.append(f"{len(snapshots)} taste snapshots")

    subtitle = " · ".join(subtitle_parts)

    fig.update_layout(
        title=dict(
            text=f"📚 Your Reading Taste Map<br><sup style='color:#64748B'>{subtitle}</sup>",
            x=0.5,
            xanchor="center",
            font=dict(size=22, family="Arial", color="#0F172A"),
        ),
        paper_bgcolor="#F8FAFC",
        plot_bgcolor="#EEF2FF",
        showlegend=True,
        legend=dict(
            title=dict(text=color_mode.title(), font=dict(size=12, color="#334155")),
            bgcolor="rgba(255,255,255,0.88)",
            bordercolor="#CBD5E1",
            borderwidth=1,
            font=dict(size=11, color="#334155"),
            itemsizing="constant",
            tracegroupgap=4,
        ),
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, showline=False, title=""),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, showline=False, title=""),
        margin=dict(l=30, r=30, t=90, b=30),
        width=1150,
        height=780,
        hoverlabel=dict(bgcolor="white", bordercolor="#CBD5E1", font=dict(size=12, color="#1E293B")),
    )

    fig.add_annotation(
        text="UMAP 2D · cosine similarity",
        x=1,
        y=0,
        xref="paper",
        yref="paper",
        xanchor="right",
        yanchor="bottom",
        showarrow=False,
        font=dict(size=9, color="#94A3B8"),
    )

    fig.write_html(args.out, include_plotlyjs="cdn")
    print(f"✅  Wrote  {args.out}  ({n_books} books, {len(snapshots)} snapshots)")


if __name__ == "__main__":
    main()
