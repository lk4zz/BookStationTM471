import EmptyLibrary from "./components/EmptyLibrary/EmptyLibrary";

function LibraryEmptySection() {
  return (
    <EmptyLibrary
      title={"Your Library is Empty"}
      body={"You haven't added any books to your library yet."}
      suggestion={"Explore Books"}
      path={"/explore"}
    />
  );
}

export default LibraryEmptySection;
