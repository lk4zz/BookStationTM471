import EmptyLibrary from "../LibraryEmptySection/components/EmptyLibrary/EmptyLibrary";

function LibraryGuestSection() {
  return (
    <EmptyLibrary
      title={"Log in to view your Library"}
      body={"Log in to view your Library"}
      suggestion={"Login"}
      path={"/login"}
    />
  );
}

export default LibraryGuestSection;
