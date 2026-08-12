import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import { routeList } from '@/constants/navigation';
import { TechLogisticsIcon } from '@/components/TechLogisticsIcon.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

function LayoutContent() {
  const { logout, user } = useAuthStore();
  const { setOpenMobile } = useSidebar();
  const userRole = user?.rol || localStorage.getItem('rol');

  const filteredNavItems = routeList.filter((item) => {
    if (!userRole) return false;
    return item.to && item.roles.includes(userRole as any);
  });

  return (
    <>
      <Sidebar className="border-none">
        <div className="flex h-full w-full flex-col bg-gradient-to-r from-[#0f4c35] to-[#080808] text-white">
          <SidebarHeader className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <p className="text-xl font-bold tracking-tight text-white">
                TechLogistics
              </p>
              <TechLogisticsIcon />
            </div>
          </SidebarHeader>

          <SidebarContent className="custom-scrollbar px-4">
            <SidebarMenu className="gap-2">
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    className="h-auto p-0 hover:bg-transparent hover:text-white active:bg-transparent"
                  >
                    <NavLink
                      className={({ isActive }) =>
                        `flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-white/15 text-white shadow-lg'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`
                      }
                      to={item.to!}
                      onClick={() => setOpenMobile(false)}
                    >
                      <span>{item.text}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-6">
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition-all hover:bg-red-500/20 hover:text-red-400"
              onClick={logout}
            >
              <span>Cerrar sesión</span>
            </button>
          </SidebarFooter>
        </div>
      </Sidebar>

      {/* Contenedor principal de la aplicación */}
      <main className="flex h-screen flex-1 flex-col overflow-hidden bg-[#080808] text-white">
        <div className="flex items-center border-b border-white/10 bg-[#080808] p-4 md:hidden">
          <SidebarTrigger className="text-white hover:text-white/80" />
          <span className="ml-3 font-bold text-white">TechLogistics</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] p-6 md:p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
