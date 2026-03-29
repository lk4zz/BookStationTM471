import Styles from './UserAvatar.module.css'
import { useNavigate } from 'react-router-dom';

function UserAvatar() {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => {
                navigate("/profile");
            }}
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