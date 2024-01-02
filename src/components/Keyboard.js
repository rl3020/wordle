import styles from "./Keyboard.module.css";

const Key = ({ letter }) => {
  return <div className={styles["keyboard-key"]}>{letter}</div>;
};

const KeyboardRow = ({ keyRow }) => {
  return (
    <div className={styles["keyboard-row"]}>
      {keyRow.map((letter) => {
        return <Key letter={letter} />;
      })}
    </div>
  );
};

const Keyboard = () => {
  const keyboardKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];
  return (
    <div className={styles["keyboard"]}>
      {keyboardKeys.map((row) => {
        return <KeyboardRow keyRow={row} />;
      })}
    </div>
  );
};

export default Keyboard;
