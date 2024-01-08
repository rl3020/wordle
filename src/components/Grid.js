import styles from "./Grid.module.css";

const getButtonColor = (colorCode) => {
  switch (colorCode) {
    case "G": // Correct
      return "green";
    case "Y": // Wrong spot but right letter
      return "#EEC643";
    case "R": // Wrong letter
      return "#333333";
    default: // Default
      return "black";
  }
};

const GameBox = ({ letter, color }) => {
  let buttonColor = getButtonColor(color);
  let borderColor = color === "B" ? "grey" : buttonColor;

  return (
    <div
      className={styles["game-box"]}
      style={{
        backgroundColor: buttonColor,
        borderColor: borderColor,
      }}
    >
      {letter}
    </div>
  );
};

const formatGuess = (guess) => {
  let guessArray = guess.split("");
  while (guessArray.length < 5) {
    guessArray.push("");
  }
  return guessArray;
};

const GameRow = ({ guess, currentColors }) => {
  // Guess array and currentColors are the same length.
  const guessArray = formatGuess(guess);

  return (
    <div className={styles["game-row"]}>
      {guessArray.map((letter, idx) => {
        return (
          <GameBox
            key={`gamebox-${idx}`}
            letter={letter}
            color={currentColors[idx]}
          />
        );
      })}
    </div>
  );
};

const GameGrid = ({ gameGrid }) => {
  // Get all rows for wordle Grid.
  const gameRows = Object.keys(gameGrid);

  // Render all rows within the game grid.
  return (
    <div>
      {gameRows.map((gameRow, idx) => {
        const currentGuess = gameGrid[gameRow]["word"];
        const currentColors = gameGrid[gameRow]["color"];
        return (
          <GameRow
            key={`gamerow-${idx}`}
            guess={currentGuess}
            currentColors={currentColors}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;
