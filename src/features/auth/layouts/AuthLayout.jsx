import React from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper";
import { IconSearch, IconShieldCheck, IconClock, IconSparkles } from "@tabler/icons-react";

export default function AuthLayout() {
  const { token } = useSelector((state) => state.auth);
  const localToken = getAccessToken();

  if (token || localToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <header className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <IconSearch className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Delcom
            </span>
            <span className="text-sm font-semibold tracking-wider text-blue-400 block -mt-1 uppercase">
              Lost &amp; Found
            </span>
          </div>
        </Link>
      </header>

      <main className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-black/40 rounded-2xl border border-slate-700/60 sm:px-10">
          <Outlet />
        </div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <IconShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Terpercaya</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <IconClock className="w-4 h-4 text-emerald-400" />
            <span>Real-time</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <IconSparkles className="w-4 h-4 text-amber-400" />
            <span>Cepat &amp; Mudah</span>
          </div>
        </div>
      </main>
    </div>
  );
}
