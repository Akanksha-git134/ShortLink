import Home from "./pages/Home.jsx";

/**
 * WHY App.jsx is this small: it's the shell. Today it just renders Home,
 * but this is also where a router would go if the app ever grew a second
 * page (e.g. a dedicated /stats page). Keeping it thin means that change
 * never requires touching business logic.
 */
function App() {
  return <Home />;
}

export default App;
