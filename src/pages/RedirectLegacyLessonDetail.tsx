import { Navigate, useParams } from "react-router-dom";

export default function RedirectLegacyLessonDetail() {
  const { id, lesson } = useParams();
  const target = id ? `/courses/${id}/lessons/${lesson || ""}` : "/courses";
  return <Navigate to={target} replace />;
}
