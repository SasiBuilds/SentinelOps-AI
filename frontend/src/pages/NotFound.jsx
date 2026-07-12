import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white">
      <h1 className="text-8xl font-bold text-cyan-400">404</h1>

      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-2 text-center">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;