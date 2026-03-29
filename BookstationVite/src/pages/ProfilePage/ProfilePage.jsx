import styles from '/ProfiePage.module.css'
import { useParams } from 'react-router-dom'
import { useBooksByAuthor } from '../../hooks/useBooks'

function ProfilePage() {
    const { booksByAuthor, isBooksByAuthorLoading, booksByAuthorError} = useBooksByAuthor();
    

    return(
        <div>

        </div>
    )
}