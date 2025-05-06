import React from "react";
import {
  FiHome,
  FiPaperclip

} from "react-icons/fi";
import { RiCoupon2Line } from "react-icons/ri";
import { PiBowlFoodLight } from "react-icons/pi";
import { useSideBar } from "../../../../providers/admin/SideBarProvider";
import { Link } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";

export const SIDE_BAR_SELECTED = {
  DASHBOARD: 1,
  FOODS: 2,
  CATEGORIES: 3,
  COUPONS: 4,
  INVOICES: 5
}

export const RouteSelect = () => {
  const { active } = useSideBar();
  return (
    <div className="space-y-6">
      <Link to={"/admin"}><Route Icon={FiHome} selected={active == SIDE_BAR_SELECTED.DASHBOARD} title="Dashboard" /></Link>
      <Link to={"/admin/products"}><Route Icon={PiBowlFoodLight} selected={active == SIDE_BAR_SELECTED.FOODS} title="Foods" /></Link>
      <Link to={"/admin/categories"}><Route Icon={MdOutlineCategory} selected={active == SIDE_BAR_SELECTED.CATEGORIES} title="Categories" /></Link>
      <Link to={"/admin/coupons"}><Route Icon={RiCoupon2Line} selected={active == SIDE_BAR_SELECTED.COUPONS} title="Coupons" /></Link>
      <Link to={"/admin/products"}><Route Icon={FiPaperclip} selected={active == SIDE_BAR_SELECTED.INVOICES} title="Invoices" /></Link>
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
}) => {
  return (

    <button
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${selected
        ? "bg-white text-stone-950 shadow"
        : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
        }`}
    >
      <Icon className={selected ? "text-[#fecb02] text-500" : ""} />
      <span>{title}</span>
    </button>
  );
};
