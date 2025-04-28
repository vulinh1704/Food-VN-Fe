import React, { useEffect } from "react";
import { StatCards } from "./StatCards";
import { ActivityGraph } from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { SIDE_BAR_SELECTED } from "../Partial/Sidebar/RouteSelect";

export const Dashboard = () => {
  const { setActive } = useSideBar();
  useEffect(() => {
    setActive(SIDE_BAR_SELECTED.DASHBOARD);
  }, []);
  return (

    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <ActivityGraph />
      <UsageRadar />
      <RecentTransactions />
    </div>

  );
};
