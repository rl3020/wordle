import styles from "./App.module.css";
import GameGrid from "./components/Grid";
import Keyboard from "./components/Keyboard";

const Navbar = () => {
  return (
    <div className={styles["navbar"]}>
      <span>Wordle</span>
    </div>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <GameGrid />
      <Keyboard />
    </>
  );
}

export default App;
