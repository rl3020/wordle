import styles from "./App.module.css";
import GameGrid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import fiveLetterWords from "./5-letter-words";
import { useState } from "react";

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
  return fiveLetterWords[randomIndex];
};

const ANSWER = getRandomWord().toUpperCase();

const Navbar = () => {
  return (
    <header className={styles["navbar"]}>
      <h1>Wordle</h1>
    </header>
  );
};

function App() {
  const [gameGrid, setGameGrid] = useState({
    0: { word: "", color: "BBBBB" },
    1: { word: "", color: "BBBBB" },
    2: { word: "", color: "BBBBB" },
    3: { word: "", color: "BBBBB" },
    4: { word: "", color: "BBBBB" },
    5: { word: "", color: "BBBBB" },
  });
  const [guessIndex, setGuessIndex] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const gameUtilities = {
    gameGrid: gameGrid,
    setGameGrid: setGameGrid,
    guessIndex: guessIndex,
    setGuessIndex: setGuessIndex,
  };

  return (
    <>
      <Navbar />
      <GameGrid gameGrid={gameGrid} />
      <Keyboard
        gameUtilities={gameUtilities}
        answer={ANSWER}
        isGameComplete={isGameComplete}
        setIsGameComplete={setIsGameComplete}
      />
    </>
  );
}

export default App;
