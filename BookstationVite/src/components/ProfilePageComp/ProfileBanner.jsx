import bannerStyles from "./ProfileBanner.module.css";

export function ProfileBanner({ imageUrl }) {
    return (
        <div className={bannerStyles.bannerContainer}>
            <div
                className={bannerStyles.bannerBackground}
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className={bannerStyles.overlay} />
        </div>
    );
}

export default ProfileBanner