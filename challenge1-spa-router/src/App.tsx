import "./App.css";
import About from "./pages/About";
import Root from "./pages/Root";
import { Route, Router } from "./router";

const App = () => {
  return (
    <main>
      <Router>
        <Route path="/" component={<Root />} />
        <Route path="/about" component={<About />} />
      </Router>
    </main>
  );
};

export default App;
