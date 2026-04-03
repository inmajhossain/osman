import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6 min-h-screen">{children}</div>
    </div>
  );
}
