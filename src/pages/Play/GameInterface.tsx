import React from "react";
import styles from "./styles/GameInterface.module.css";
import Header from "./components/Header.tsx";
import DiscardArea from "./components/DiscardArea.tsx";
import HandStatus from "./components/HandStatus.tsx";
import WaitingTiles from "./components/WaitingTiles.tsx";
import HandTiles from "./components/HandTiles.tsx";

const GameInterface = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.gridContainer}>
        <span className={styles.discardArea}>
          <DiscardArea />
        </span>
        <span className={styles.handStatus}>
          <HandStatus />
        </span>
        <span className={styles.waitingTiles}>
          <WaitingTiles />
        </span>
      </div>
      <HandTiles />
    </div>
  );
};

export default GameInterface;
