import styles from "./App.module.css";
import GameGrid from "./components/Grid";

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
    </>
  );
}

export default App;
