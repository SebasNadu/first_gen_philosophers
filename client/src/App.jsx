import "./App.css";
import { Navbar } from "./components/navbar.jsx";
import ExamplePage from "./pages/example";
import CreateArticlePage from "./pages/CreateArticlePage";

function App() {
  return (
    <>
      {/* <Navbar />*/}
      <CreateArticlePage />
      <ExamplePage />
    </>
  );
}

export default App;
