import { Metadata } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";
import DefaultView from "src/pages/HomePage/DefaultView";
import ParticipantView from "src/pages/HomePage/ParticipantView";

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <>
        <Metadata title="Home" description="Home page" />

        <LoadingSpinner />
      </>
    )
  }

  if (isAuthenticated) {
    return <ParticipantView />;
  }

  return <DefaultView />;
}

export default HomePage;
