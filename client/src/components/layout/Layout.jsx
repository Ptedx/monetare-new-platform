import { Sidebar } from "./Sidebar";
import { ClientHeader } from "./ClientHeader";
import { ProfileSwitcher } from "./ProfileSwitcher";

export function Layout({ children }) {
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'cliente') {
    return (
      <div className="flex flex-col min-h-screen bg-[#eef0f3]">
        <ClientHeader />
        <ProfileSwitcher />
        <main className="flex-1 w-full pt-28 pb-12 px-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#dddddd] p-6 gap-6">
      <ProfileSwitcher />
      <div className="h-full">
        <Sidebar />
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-auto">
        {children}
      </div>
    </div>
  );
}
