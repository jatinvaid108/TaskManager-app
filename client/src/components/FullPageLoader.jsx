import { ClipLoader } from "react-spinners";

// Dark full-screen spinner shown while the session is being checked
export default function FullPageLoader() {
  return (
    <div className="theme-dark flex min-h-screen items-center justify-center bg-night">
      <ClipLoader color="#A78BFA" size={40} />
    </div>
  );
}
