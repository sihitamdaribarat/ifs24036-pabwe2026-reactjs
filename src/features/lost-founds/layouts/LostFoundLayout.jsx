import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper";
import { asyncGetProfile } from "../../users/states/userSlice";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";
import AddModal from "../modals/AddModal";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.users);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState("list"); // 'list' | 'stats'

  const localToken = getAccessToken();

  // Route Guarding: redirect to login if no token
  if (!token && !localToken) {
    return <Navigate to="/auth/login" replace />;
  }

  // Load user profile session if not yet loaded
  useEffect(() => {
    if (!profile && (token || localToken)) {
      dispatch(asyncGetProfile());
    }
  }, [dispatch, profile, token, localToken]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <SidebarComponent
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenAddModal={() => setAddModalOpen(true)}
          activeTab={dashboardTab}
          onTabChange={(tab) => setDashboardTab(tab)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet
            context={{
              onOpenAddModal: () => setAddModalOpen(true),
              dashboardTab,
              setDashboardTab,
            }}
          />
        </main>
      </div>

      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          // Trigger refresh event or action
          window.dispatchEvent(new CustomEvent("lost-found-added"));
        }}
      />
    </div>
  );
}
