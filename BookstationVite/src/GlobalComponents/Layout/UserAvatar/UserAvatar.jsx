import Styles from './UserAvatar.module.css'
import { User } from "lucide-react";

function UserAvatar({ onClick, profileUrl }) {
    console.log(profileUrl)
    return (
        <div onClick={onClick} className={Styles.avatarContainer}>
            <div className={Styles.avatarRing}>
                {profileUrl ? (
                    <img
                        src={profileUrl}
                        alt="User Profile"
                        className={Styles.avatarImage} 
                    />
                ) : (
                    // Wrap the icon in a fallback div
                    <div className={Styles.avatarFallback}>
                        {/* You can explicitly set the size and color here */}
                        <User size={25} /> 
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserAvatar;