import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { getFormattedDate } from "../../../../lib/format-hepper";

export const TopBar = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">🚀 Hello, Admin!</span>
          <span className="text-xs block text-stone-500">
            {getFormattedDate()}
          </span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-[#fecb02] bg-100 hover:text-white text-700 px-3 py-1.5 rounded" onClick={() => { logout() }}>
          <IoLogOutOutline />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
