import styles from "./App.module.css";
import GameGrid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import fiveLetterWords from "./5-letter-words";
import { useEffect, useState } from "react";

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

const getBoxColor = (currentGuess, keyboardUtilities) => {
  const getCharCount = () => {
    let charMap = {};
    for (let i = 0; i < ANSWER.length; i++) {
      if (ANSWER[i] in charMap) {
        charMap[ANSWER[i]] += 1;
      } else {
        charMap[ANSWER[i]] = 1;
      }
    }
    return charMap;
  };

  const getGreens = (currentGuess, answerCharCount, colorResult) => {
    for (let i = 0; i < 5; i++) {
      const guessChar = currentGuess[i];
      const answerChar = ANSWER[i];
      if (guessChar === answerChar) {
        colorResult[i] = "G";
        keyColors[guessChar] = "G";
        answerCharCount[guessChar] -= 1;
      }
    }
  };

  const getYellows = (currentGuess, answerCharCount, colorResult) => {
    for (let i = 0; i < 5; i++) {
      const guessChar = currentGuess[i];
      const answerChar = ANSWER[i];
      if (
        guessChar !== answerChar &&
        ANSWER.includes(guessChar) &&
        answerCharCount[guessChar] - 1 >= 0
      ) {
        colorResult[i] = "Y";
        keyColors[guessChar] = "Y";
        answerCharCount[guessChar] -= 1;
      }
    }
  };

  const getGreys = (currentGuess, colorResult) => {
    for (let i = 0; i < 5; i++) {
      if (colorResult[i] === "") {
        colorResult[i] = "R";
        const guessChar = currentGuess[i];
        if (!(guessChar in keyColors)) {
          keyColors[guessChar] = "R";
        }
      }
    }
  };

  let answerCharCount = getCharCount(ANSWER);
  let colorResult = ["", "", "", "", ""];
  let keyColors = keyboardUtilities.keyColors;
  const setKeyColors = keyboardUtilities.setKeyColors;

  getGreens(currentGuess, answerCharCount, colorResult, keyColors);
  getYellows(currentGuess, answerCharCount, colorResult, keyColors);
  getGreys(currentGuess, colorResult, keyColors);
  setKeyColors({ ...keyColors });
  return colorResult.join("");
};

const checkWord = (currentGuess, gameUtilities, keyboardUtilities) => {
  const gameGrid = gameUtilities.gameGrid;
  const guessIndex = gameUtilities.guessIndex;
  const setGameGrid = gameUtilities.setGameGrid;
  const setGuessIndex = gameUtilities.setGuessIndex;
  const setIsGameComplete = gameUtilities.setIsGameComplete;
  console.log("checking: ", currentGuess, "\nActual word: ", ANSWER);
  let colorResult = getBoxColor(currentGuess, keyboardUtilities);

  gameGrid[guessIndex]["color"] = colorResult;
  setGameGrid({ ...gameGrid });
  setGuessIndex(guessIndex + 1);
  if (colorResult === "GGGGG") {
    setIsGameComplete(true);
  }
};

const handleEnter = (currentGuess, gameUtilities, keyboardUtilities) => {
  if (currentGuess.length < 5) {
    alert("Your guess is incomplete :/");
  } else {
    checkWord(currentGuess, gameUtilities, keyboardUtilities);
  }
};

const handleDelete = (currentGuess) => {
  if (currentGuess.length < 0) {
    return currentGuess;
  }
  return currentGuess.slice(0, currentGuess.length - 1);
};

const handleLetter = (currentGuess, inputLetter) => {
  if (currentGuess.length === 5) {
    return currentGuess;
  }
  return currentGuess + inputLetter;
};

const updateGuess = (currentGuess, inputLetter, gameUtilities) => {
  const gameGrid = gameUtilities.gameGrid;
  const guessIndex = gameUtilities.guessIndex;
  const setGameGrid = gameUtilities.setGameGrid;
  let updatedGuess = "";

  if (inputLetter === "BACKSPACE") {
    updatedGuess = handleDelete(currentGuess);
  } else if (inputLetter !== "ENTER" && inputLetter !== "BACKSPACE") {
    updatedGuess = handleLetter(currentGuess, inputLetter);
  }
  console.log("Updating guess to: ", updatedGuess);
  // Update the gameGrid when processes user input.
  gameGrid[guessIndex]["word"] = updatedGuess;
  setGameGrid({ ...gameGrid });
};

const continueGame = (guessIndex, isGameComplete) => {
  if (guessIndex > 5) {
    alert("You tried. Good game lol");
    return false;
  } else if (isGameComplete) {
    alert("You already one. Stop trying so hard.");
    return false;
  }
  return true;
};

const isValidUserInput = (inputLetter) => {
  function isLetter(char) {
    return (
      /^[a-zA-Z]$/.test(char) ||
      // keyboard commands
      char === "Backspace" ||
      char === "Enter" ||
      // html keyboard commands
      char === "DELETE" ||
      char === "ENTER"
    );
  }
  if (isLetter(inputLetter)) return true;
  else return false;
};

const cleanUserInput = (inputLetter) => {
  switch (inputLetter) {
    case "DELETE":
      return "BACKSPACE";
    default:
      return inputLetter.toUpperCase();
  }
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
  const [keyColors, setKeyColors] = useState({});
  const gameUtilities = {
    gameGrid: gameGrid,
    setGameGrid: setGameGrid,
    guessIndex: guessIndex,
    setGuessIndex: setGuessIndex,
    isGameComplete: isGameComplete,
    setIsGameComplete: setIsGameComplete,
  };
  const keyboardUtilities = {
    keyColors: keyColors,
    setKeyColors: setKeyColors,
  };

  const handleUserInput = (inputLetter) => {
    if (!continueGame(guessIndex, isGameComplete)) return;
    if (!isValidUserInput(inputLetter)) return;
    inputLetter = cleanUserInput(inputLetter);

    const currentGuess = gameGrid[guessIndex]["word"];

    if (inputLetter === "ENTER") {
      handleEnter(currentGuess, gameUtilities, keyboardUtilities);
    } else {
      updateGuess(currentGuess, inputLetter, gameUtilities);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleUserInput(event.key);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <Navbar />
      <GameGrid gameGrid={gameGrid} />
      <Keyboard keyColors={keyColors} handleUserInput={handleUserInput} />
    </>
  );
}

export default App;
