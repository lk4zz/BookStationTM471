import Styles from './UserAvatar.module.css'

function UserAvatar({ onClick, profileUrl}) {

    return (
        <div
            onClick={onClick}
            className={Styles.avatarContainer}>
            <div className={Styles.avatarRing}>
                <img
                    src={profileUrl}
                    alt="User Profile"
                    className={Styles.avatarImage}
                />
            </div>
            
        </div>
    )
}

export default UserAvatar;