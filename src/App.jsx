import { useState, useEffect } from "react";

function MovieCard({ movie, showRatings, onFavorite }) {
  function handleFavorite() {
    onFavorite(movie);
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "8px",
      }}
    >
      <h2>{movie.title}</h2>

      {showRatings && <p>⭐ {movie.rating}</p>}

      <p>{movie.year}</p>
      <p>{movie.genre}</p>

      <button onClick={handleFavorite}>Favorite</button>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("batman");
  const [showRatings, setShowRatings] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery || "batman");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
            debouncedQuery
          )}`
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();

        const formattedMovies = data.map((item) => ({
          id: item.show.id,
          title: item.show.name,
          rating: item.show.rating.average || "N/A",
          year: item.show.premiered
            ? item.show.premiered.slice(0, 4)
            : "N/A",
          genre: item.show.genres[0] || "Unknown",
        }));

        setMovies(formattedMovies);
      } catch {
        setError("Failed to fetch movies");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [debouncedQuery]);

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleAddFavorite(movie) {
    const alreadyFavorite = favorites.some(
      (fav) => fav.id === movie.id
    );

    if (alreadyFavorite) {
      return;
    }

    setFavorites((prev) => [...prev, movie]);
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Movie Discovery</h1>

      <p>
        <strong>Favorites:</strong> {favorites.length}
      </p>

      <h2>Favorite Movies</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}

      <hr />

      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {searchQuery && (
          <button onClick={() => setSearchQuery("")}>
            Clear
          </button>
        )}

        <button
          onClick={() => setShowRatings(!showRatings)}
        >
          {showRatings ? "Hide Ratings" : "Show Ratings"}
        </button>
      </div>

      <p>Searching for: {debouncedQuery}</p>
      <p>{movies.length} movies found</p>

      <hr />

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : isLoading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showRatings={showRatings}
            onFavorite={handleAddFavorite}
          />
        ))
      )}
    </main>
  );
}

export default App;