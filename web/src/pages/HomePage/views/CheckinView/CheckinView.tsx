import {useSidebar} from "@/layouts/SidebarLayout/SidebarLayout";
import CheckinDetails from "@/pages/HomePage/views/CheckinView/CheckinDetails";
import CheckinOverview from "@/pages/HomePage/views/CheckinView/CheckinOverview";
import {useEffect} from "react";

const subViewMap: Record<string, React.ComponentType> = {
  "Overview": CheckinOverview,
  "Details": CheckinDetails,
}


const CheckinView = () => {
  const {subState, setSubState} = useSidebar()
  const SubView = subViewMap[subState]

  useEffect(() => {
    setSubState("Overview")
  }, [setSubState]);

  if (subState == "Details")
    return <CheckinDetails participantId="9a9d3011-5775-41e0-9ae9-c0f453b59641"/>

  return SubView ? <SubView /> : <CheckinOverview />
};

export default CheckinView;
