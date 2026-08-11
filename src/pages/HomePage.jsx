import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("batman");
    const [showRatings, setShowRatings] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });


    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);


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

                const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(debouncedQuery)}`);

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

  function handleAddFavorite(movie) {
    const alreadyFavorite = favorites.some(
      (fav) => fav.id === movie.id
    );

    if (alreadyFavorite) {
      return;
    }
    
    setFavorites((prev) => [...prev, movie]);
  }

  function handleRemoveFavorite(movieId) {
    setFavorites((prev) =>
      prev.filter((movie) => movie.id !== movieId)
    );
  }

  return (
    <main className="container">
      <h1 className="title">Movie Discovery</h1>

      <div className="favorites-panel">
        <h2>Favorites ({favorites.length})</h2>

        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <ul>
            {favorites.map((movie) => (
              <li key={movie.id}>
                {movie.title}{" "}
                <button
                  onClick={() =>
                    handleRemoveFavorite(movie.id)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="controls">
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

      {error ? (
        <p className="error">{error}</p>
      ) : isLoading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link
                to={`/movie/${movie.id}`}
                className="movie-link"
              >
                <h2>{movie.title}</h2>
              </Link>

              {showRatings && (
                <p>⭐ {movie.rating}</p>
              )}

              <p>{movie.year}</p>
              <p>{movie.genre}</p>

              <button
                onClick={() => handleAddFavorite(movie)}
              >
                Favorite
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;