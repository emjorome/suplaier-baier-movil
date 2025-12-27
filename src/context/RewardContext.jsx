import React, { createContext, useContext, useState } from "react";

const RewardContext = createContext();

export const useReward = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error("useReward debe usarse dentro de un RewardProvider");
  }
  return context;
};

export const RewardProvider = ({ children }) => {
  const [reward, setReward] = useState({
    show: false,
    title: "",
    message: "",
    stars: 0,
    balance: null,
    onClose: null,
  });

  const showReward = ({ title, message, stars, balance, onClose }) => {
    setReward({
      show: true,
      title,
      message,
      stars,
      balance,
      onClose,
    });
  };

  const hideReward = () => {
    const callback = reward.onClose;
    setReward({
      show: false,
      title: "",
      message: "",
      stars: 0,
      balance: null,
      onClose: null,
    });
    if (callback) {
      callback();
    }
  };

  return (
    <RewardContext.Provider value={{ reward, setReward: showReward, hideReward }}>
      {children}
    </RewardContext.Provider>
  );
};

