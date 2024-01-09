import styles from "./App.module.css";
import GameGrid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import fiveLetterWords from "./5-letter-words";
import { useEffect, useState } from "react";
import gptImage from "./gpt.webp";

// Helper functions to mostly manage gameplay.
const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
  return fiveLetterWords[randomIndex];
};

const ANSWER = getRandomWord().toUpperCase();

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

// Components
const Navbar = () => {
  return (
    <header className={styles["navbar"]}>
      <a href="/">
        <h1>Wordle</h1>
      </a>
    </header>
  );
};

const ChallengeGPTButton = ({ setIsChatGptChallenged }) => {
  const handleClick = () => {
    setIsChatGptChallenged(true);
  };
  return (
    <button onClick={handleClick} className={styles["challenge-gpt-btn"]}>
      Challenge ChatGPT 🫡
    </button>
  );
};

const GptTextbox = ({ text, isActive }) => {
  return (
    <div
      className={`${styles["gpt-textbox"]} ${
        isActive ? "" : styles["not-active"]
      }`}
    >
      <span>{text}</span>
    </div>
  );
};

// GPT makes guesses!!
const GPT = ({ isGptChallenged, guessResult, createUserInput }) => {
  const [activeMessage, setActiveMessage] = useState(
    "You have summoned me, GPT. What fools ..."
  );

  const [pastMessages, setPastMessages] = useState([]);

  useEffect(() => {
    guessGpt();
  }, []);

  const guessGpt = async () => {
    try {
      const payload = { value: guessResult };
      console.log("Loaded !!");
      const response = await fetch("http://127.0.0.1:5000/api/gpt-guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log(result);
      const gpt_guess = result["guess"];
      const gpt_response = result["sassy_response"];

      for (let i = 0; i < gpt_guess.length; i++) {
        createUserInput(gpt_guess[i]);
      }
      setPastMessages([...pastMessages, activeMessage]);
      setActiveMessage(gpt_response);

      // Make a complete guess then press enter
      createUserInput("ENTER");
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div
      className={styles["gpt"]}
      style={{ display: isGptChallenged ? "flex" : "none" }}
    >
      <img
        alt={"This is gpt."}
        className={styles["gpt-image"]}
        src={gptImage}
      />
      <div>
        {/* Current text */}
        <GptTextbox text={activeMessage} isActive={true} />
        {/* Past messages */}
        <div className={styles["gpt-textbox-wrapper"]}>
          {pastMessages.map((messageText, idx) => {
            return (
              <GptTextbox
                key={`gpt-text-box-${idx}`}
                text={messageText}
                isActive={false}
              />
            );
          })}
        </div>
      </div>
    </div>
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
  const [isGptChallenged, setIsChatGptChallenged] = useState(false);
  const [keyColors, setKeyColors] = useState({});
  const [isNewGame, setIsNewGame] = useState(true);
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
    if (isNewGame) {
      restartGame();
      setIsNewGame(false);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const restartGame = async () => {
    try {
      const request = await fetch("http://127.0.0.1:5000/api/new-game", {
        method: "POST",
      });
    } catch (error) {
      console.log("Error fetching request.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles["summoning-gpt"]}>
        {/* game wrapper here */}
        <div
          className={`${styles["game-wrapper"]}
          ${!isGptChallenged ? styles["horizontally-center"] : ""}  
          `}
        >
          <GameGrid gameGrid={gameGrid} />
          <Keyboard keyColors={keyColors} handleUserInput={handleUserInput} />
          <ChallengeGPTButton setIsChatGptChallenged={setIsChatGptChallenged} />
        </div>
        {isGptChallenged ? (
          <GPT
            isGptChallenged={isGptChallenged}
            guessResult={guessIndex === 0 ? "" : gameGrid[guessIndex]}
            createUserInput={handleUserInput}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
