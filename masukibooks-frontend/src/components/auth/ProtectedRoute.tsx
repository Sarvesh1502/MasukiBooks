import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}