import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
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
                const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(debouncedQuery)}`);
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                const data = await response.json();
                const formattedMovies = data.map((item) => ({
                    id: item.show.id,
                    title: item.show.name,
                    rating: item.show.rating.average || "N/A",
                    year: item.show.premiered ? item.show.premiered.slice(0, 4) : "N/A",
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

        <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
            }}
        />

        <div style={{ marginBottom: "16px" }}>
            {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                    Clear
                </button>
            )}

            <button
                onClick={() => setShowRatings(!showRatings)}
                style={{ marginLeft: "10px" }}
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
                <div
                    key={movie.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "16px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                    }}
                >
                    <Link
                        to={`/movie/${movie.id}`}
                        style={{
                            textDecoration: "none",
                            color: "#2563eb",
                        }}
                    >
                    <h2>{movie.title}</h2>
                    </Link>

                    {showRatings && <p>⭐ {movie.rating}</p>}

                    <p>{movie.year}</p>
                    <p>{movie.genre}</p>

                    <button onClick={() => handleAddFavorite(movie)}>Favorite</button>
                </div>
            ))
        )}
        </main>
    );
}

export default HomePage;