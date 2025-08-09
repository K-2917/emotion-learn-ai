import { Navigate, useParams } from "react-router-dom";

export default function RedirectLegacyLesson() {
  const { id } = useParams();
  const target = id ? `/courses/${id}/lessons` : "/courses";
  return <Navigate to={target} replace />;
}
