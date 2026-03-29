import Styles from './UserAvatar.module.css'

function UserAvatar({ onClick }) {

    return (
        <div
            onClick={onClick}
            className={Styles.avatarContainer}>
            <div className={Styles.avatarRing}>
                <img
                    src="/your-default-image.jpg"
                    alt="User Profile"
                    className={Styles.avatarImage}
                />
            </div>
            <span className={Styles.statusDot}></span>
        </div>
    )
}

export default UserAvatar;