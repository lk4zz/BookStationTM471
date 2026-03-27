import ChaptersPanel from "../../components/ReadingPageComp/ChaptersPanel";
import { useChaptersByBook } from "../../hooks/useChapters";
import { useParams } from "react-router-dom";


function ReadingPage() {
const { id } = useParams();
  const numericId = Number(id);
  const { chapters, isChapterLoading } = useChaptersByBook(numericId);
    return (
    <div>   
        <ChaptersPanel chapters={chapters} isChapterLoading={isChapterLoading} /> 
    </div>
    )
}

export default ReadingPage;