import styles from "./Keyboard.module.css";

const Key = ({ letter, keyColors, handleUserInput }) => {
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

  const handleClick = () => {
    handleUserInput(letter);
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

const KeyboardRow = ({ keysInRow, keyColors, handleUserInput }) => {
  return (
    <div className={styles["keyboard-row"]}>
      {keysInRow.map((letter, idx) => {
        return (
          <Key
            key={`${letter}-${idx}`}
            letter={letter}
            keyColors={keyColors}
            handleUserInput={handleUserInput}
          />
        );
      })}
    </div>
  );
};

const Keyboard = ({ keyColors, handleUserInput }) => {
  const keyboardKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  return (
    <div className={styles["keyboard"]}>
      {keyboardKeys.map((keysInRow, idx) => {
        return (
          <KeyboardRow
            key={`row-${idx}`}
            keysInRow={keysInRow}
            keyColors={keyColors}
            handleUserInput={handleUserInput}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
