import "./App.css";
import { Navbar42 } from "./components/Navbar.jsx";
import ExamplePage from "./pages/example";
import CreateArticlePage from "./pages/CreateArticlePage";

function App() {
  return (
    <>
      <Navbar42 />
      <CreateArticlePage />
      <ExamplePage />
    </>
  );
}

export default App;