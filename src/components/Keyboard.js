import styles from "./Keyboard.module.css";
import { useState } from "react";

const Key = ({
  letter,
  gameUtilities,
  answer,
  isGameComplete,
  setIsGameComplete,
  keyColors,
  setKeyColors,
}) => {
  const gameGrid = gameUtilities.gameGrid;
  const setGameGrid = gameUtilities.setGameGrid;
  const guessIndex = gameUtilities.guessIndex;
  const setGuessIndex = gameUtilities.setGuessIndex;

  const getBoxColor = (currentGuess) => {
    const getCharCount = (answer) => {
      let charMap = {};
      for (let i = 0; i < answer.length; i++) {
        if (answer[i] in charMap) {
          charMap[answer[i]] += 1;
        } else {
          charMap[answer[i]] = 1;
        }
      }
      return charMap;
    };

    const getGreens = (answerCharCount, colorResult) => {
      for (let i = 0; i < 5; i++) {
        const guessChar = currentGuess[i];
        const answerChar = answer[i];
        if (guessChar === answerChar) {
          colorResult[i] = "G";
          keyColors[guessChar] = "G";
          answerCharCount[guessChar] -= 1;
        }
      }
    };

    const getYellows = (answerCharCount, colorResult) => {
      for (let i = 0; i < 5; i++) {
        const guessChar = currentGuess[i];
        const answerChar = answer[i];
        if (
          guessChar !== answerChar &&
          answer.includes(guessChar) &&
          answerCharCount[guessChar] - 1 >= 0
        ) {
          colorResult[i] = "Y";
          keyColors[guessChar] = "Y";
          answerCharCount[guessChar] -= 1;
        }
      }
    };

    const getGreys = (colorResult) => {
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

    let answerCharCount = getCharCount(answer);
    let colorResult = ["", "", "", "", ""];
    getGreens(answerCharCount, colorResult);
    getYellows(answerCharCount, colorResult);
    getGreys(colorResult);
    setKeyColors({ ...keyColors });
    return colorResult.join("");
  };

  const checkWord = (currentGuess) => {
    console.log("checking: ", currentGuess, "\nActual word: ", answer);
    let colorResult = getBoxColor(currentGuess);

    gameGrid[guessIndex]["color"] = colorResult;
    setGameGrid({ ...gameGrid });
    setGuessIndex(guessIndex + 1);
    if (colorResult === "GGGGG") {
      setIsGameComplete(true);
    }
  };

  const handleEnter = (currentGuess) => {
    if (currentGuess.length < 5) {
      alert("Your guess is incomplete :/");
    } else {
      checkWord(currentGuess);
    }
  };

  const handleDelete = (currentGuess) => {
    if (currentGuess.length < 0) {
      return;
    }

    let updatedGuess = currentGuess.slice(0, currentGuess.length - 1);
    gameGrid[guessIndex]["word"] = updatedGuess;
    setGameGrid({ ...gameGrid });
  };

  const handleLetter = (currentGuess) => {
    if (currentGuess.length === 5) {
      return;
    }

    let updatedGuess = currentGuess + letter;
    gameGrid[guessIndex]["word"] = updatedGuess;
    setGameGrid({ ...gameGrid });
  };

  const handleClick = () => {
    if (guessIndex > 5) {
      alert("You tried. Good game lol");
      return;
    } else if (isGameComplete) {
      alert("You already one. Stop trying so hard.");
      return;
    }

    const currentGuess = gameGrid[guessIndex]["word"];
    if (letter === "ENTER") {
      handleEnter(currentGuess);
    } else if (letter === "DELETE") {
      handleDelete(currentGuess);
    } else if (letter !== "ENTER" && letter !== "DELETE") {
      handleLetter(currentGuess);
    }
  };

  const getKeyColor = () => {
    if (letter in keyColors) {
      switch (keyColors[letter]) {
        case "G": // Correct
          return "green";
        case "Y": // Wrong spot but right letter
          return "#EEC643";
        case "R": // Wrong letter
          return "#333333";
        default: // Default
          return "grey";
      }
    }
    return "";
  };

  return (
    <button
      className={styles["keyboard-key"]}
      style={{ backgroundColor: getKeyColor() }}
      onClick={handleClick}
    >
      {letter}
    </button>
  );
};

const KeyboardRow = ({
  keyRow,
  gameUtilities,
  answer,
  isGameComplete,
  setIsGameComplete,
  keyColors,
  setKeyColors,
}) => {
  return (
    <div className={styles["keyboard-row"]}>
      {keyRow.map((letter, idx) => {
        return (
          <Key
            key={`key-${idx}`}
            letter={letter}
            gameUtilities={gameUtilities}
            answer={answer}
            isGameComplete={isGameComplete}
            setIsGameComplete={setIsGameComplete}
            keyColors={keyColors}
            setKeyColors={setKeyColors}
          />
        );
      })}
    </div>
  );
};

const Keyboard = ({
  gameUtilities,
  answer,
  isGameComplete,
  setIsGameComplete,
}) => {
  const keyboardKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  const [keyColors, setKeyColors] = useState({});

  return (
    <div className={styles["keyboard"]}>
      {keyboardKeys.map((row, idx) => {
        return (
          <KeyboardRow
            key={`row-${idx}`}
            keyRow={row}
            gameUtilities={gameUtilities}
            answer={answer}
            isGameComplete={isGameComplete}
            setIsGameComplete={setIsGameComplete}
            keyColors={keyColors}
            setKeyColors={setKeyColors}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
