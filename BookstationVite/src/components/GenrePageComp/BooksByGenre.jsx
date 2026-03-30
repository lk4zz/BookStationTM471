import BookCard from "../UI/BookCard/BookCard"
import { useBooksByGenre } from "../../hooks/useBooks"


function BooksByGenre(incomingGenreData) {
    const { genre } = incomingGenreData;
    const genreId = genre
    console.log(genreId)
    const {books, isBooksLoading, booksError} = useBooksByGenre(genreId)

    if(isBooksLoading) return <p className="loading">Loading...</p>
    if(booksError) return <p  className="loading">{booksError.message}</p>

    return (
        <div className="gridContainer">
            {books.map((book) => (
                <BookCard key={book.id} book={book}/>
            ))}
        </div>
    )
}

export default BooksByGenre 