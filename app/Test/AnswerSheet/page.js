import FacultyAside from "@/components/DefaultFix/FacultyAside";
import AnswerSheet from "@/components/TestPaper/AnswerSheet";

export default function AnswerSheetPage() {
  return (
    <main className="container-fluid">
      <div className="row ">
        <FacultyAside />
        <AnswerSheet />
      </div>
    </main>
  );
}
