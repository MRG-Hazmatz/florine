import { useParams, Link } from "react-router-dom";
import { getExam } from "../lib/exams/load";
import ExamRunner from "../components/exam/ExamRunner";

export default function ExamView() {
  const { examId } = useParams();
  const exam = examId ? getExam(examId) : undefined;

  if (!exam) {
    return (
      <p className="text-ink/60">
        Exam not found.{" "}
        <Link to="/exams" className="text-marine underline">
          Back to exams
        </Link>
      </p>
    );
  }

  return <ExamRunner exam={exam} />;
}
