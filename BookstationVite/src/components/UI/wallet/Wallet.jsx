import styles from './Wallet.module.css'
import { WalletIcon } from '../IconLibrary';
import { useNavigate } from 'react-router-dom';


function Wallet({ balance }) {
const navigate = useNavigate();
    return (

        <div 
        onClick={() => navigate('/wallet/buy')}
         className={styles.wallet}>
            <WalletIcon className={styles.walletIcon}/>
            <p> {balance}</p>
        </div>
    )
}

export default Wallet;