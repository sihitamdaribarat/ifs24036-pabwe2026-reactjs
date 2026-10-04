import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconChartBar,
  IconUsers,
  IconUser,
  IconX,
  IconPlus,
} from "@tabler/icons-react";

export default function SidebarComponent({
  isOpen,
  onClose,
  onOpenAddModal,
  activeTab,
  onTabChange,
}) {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard Laporan",
      path: "/",
      icon: IconLayoutDashboard,
      tab: "list",
    },
    {
      name: "Statistik",
      path: "/#stats",
      icon: IconChartBar,
      tab: "stats",
    },
    {
      name: "Daftar Pengguna",
      path: "/users",
      icon: IconUsers,
    },
    {
      name: "Profil Saya",
      path: "/profile",
      icon: IconUser,
    },
  ];

  const handleNavClick = (item) => {
    if (onClose) onClose();
    if (item.tab && onTabChange && location.pathname === "/") {
      onTabChange(item.tab);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex-1 flex flex-col">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 md:hidden">
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              Menu Navigasi
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          {onOpenAddModal && (
            <button
              onClick={() => {
                if (onClose) onClose();
                onOpenAddModal();
              }}
              className="w-full mb-6 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition duration-200 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <IconPlus className="w-3.5 h-3.5" />
              </div>
              <span>Tambah Laporan</span>
            </button>
          )}

          {/* Main Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Utama
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isExactDashboard = item.path === "/" && location.pathname === "/" && activeTab !== "stats";
              const isStatsActive = item.tab === "stats" && location.pathname === "/" && activeTab === "stats";
              const isOtherActive = item.path !== "/" && item.path !== "/#stats" && location.pathname.startsWith(item.path);

              const isActive = isExactDashboard || isStatsActive || isOtherActive;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Delcom Lost &amp; Found
          </p>
          <p className="text-[10px] mt-0.5">Versi 1.0 • React + Redux</p>
        </div>
      </aside>
    </>
  );
}
