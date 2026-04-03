import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center bg-slate-100 font-sans">
      <Sidebar />
    </div>
  );
}
