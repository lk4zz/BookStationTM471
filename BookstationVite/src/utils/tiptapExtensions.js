import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export const extensions = [
  StarterKit,

  Underline,

  Highlight,

  Link.configure({
    openOnClick: false,
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  Placeholder.configure({
    placeholder: "Start writing your masterpiece...",
  }),
];