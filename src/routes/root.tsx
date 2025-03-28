import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Root() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
    </>
  );
}
