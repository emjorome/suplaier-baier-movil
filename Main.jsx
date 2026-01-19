import  React  from "react";
import AppRouter from "./src/router/AppRouter.jsx";
import RewardModal from "./src/components/RewardModal.jsx";
import { useReward } from "./src/context/RewardContext.jsx";

const Main = () => {
  const { reward, hideReward } = useReward();

  return (
    <>
      <AppRouter />
      <RewardModal
        visible={reward.show}
        title={reward.title}
        message={reward.message}
        stars={reward.stars}
        balance={reward.balance}
        onClose={hideReward}
      />
    </>
  );
};

export default Main;
