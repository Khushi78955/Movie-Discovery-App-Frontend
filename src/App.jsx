import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/movie/:id"
        element={<MovieDetailsPage />}
      />
    </Routes>
  );
}

export default App;