import styles from "./Grid.module.css";
import { useState } from "react";

const GameBox = ({ letter }) => {
  return <div className={styles["game-box"]}>{letter}</div>;
};

const GameRow = ({ gameRowContent }) => {
  return (
    <div className={styles["game-row"]}>
      {gameRowContent.map((letter) => {
        return <GameBox letter={letter} />;
      })}
    </div>
  );
};

const GameGrid = () => {
  const [gameGrid, setGameGrid] = useState([
    ["H", "E", "L", "L", "O"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  return (
    <div className={styles["game-grid"]}>
      {gameGrid.map((gameRow) => {
        return <GameRow gameRowContent={gameRow} />;
      })}
    </div>
  );
};

export default GameGrid;
