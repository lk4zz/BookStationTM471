import CreateBookModal from "./components/CreateBookModal/CreateBookModal";

function WritingDashboardCreateBookModalSection({
  open,
  onClose,
  onCreate,
  isPending,
}) {
  return (
    <CreateBookModal
      open={open}
      onClose={onClose}
      onCreate={onCreate}
      isPending={isPending}
    />
  );
}

export default WritingDashboardCreateBookModalSection;
