import {SidebarItem, useSidebar} from "@/layouts/SidebarLayout/SidebarLayout";
import DashboardView from "@/pages/HomePage/views/DashboardView/DashboardView";
import QuartierView from "@/pages/HomePage/views/QuartierView/QuartierView";
import CheckinView from "@/pages/HomePage/views/CheckinView/CheckinView";
import JoinStaffView from "@/pages/HomePage/views/JoinStaffView/JoinStaffView";

const viewMap: Record<SidebarItem, React.ComponentType> = {
  "Dashboard": DashboardView,
  "Quartier": QuartierView,
  "Checkin": CheckinView,
  "Join the Team": JoinStaffView,
  "Mitarbeiter": ManageStaffView,
}

import React from 'react';
import ManageStaffView from "@/pages/HomePage/views/ManageStaffView/ManageStaffView";

const ViewRouter = () => {
  const { sidebarItem } = useSidebar()
  const View = viewMap[sidebarItem]
  return View ? <View /> : null
};

export default ViewRouter;
