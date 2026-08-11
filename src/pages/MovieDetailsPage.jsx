import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetailsPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMovie() {
            try {
                setIsLoading(true);
                setError("");
                const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                const data = await response.json();
                setMovie(data);
            } catch {
                setError("Failed to fetch movie details");
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovie();
    }, [id]);

    if (error) {
        return (
            <main className="container">
                <Link to="/" className="back-link">← Back to Home</Link>
                <p className="error">{error}</p>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="container">
                <Link to="/">← Back to Home</Link>
                <p>Loading movie details...</p>
            </main>
        );
    }

    return (
        <main className="container">
        <Link to="/">← Back to Home</Link>

        <h1 className="title">{movie.name}</h1>

        <p>
            <strong>Rating:</strong>{" "}
            {movie.rating.average || "N/A"}
        </p>

        <p>
            <strong>Year:</strong>{" "}
            {movie.premiered
                ? movie.premiered.slice(0, 4)
                : "N/A"}
        </p>

        <p>
            <strong>Genre:</strong>{" "}
            {movie.genres[0] || "Unknown"}
        </p>

        <div
            dangerouslySetInnerHTML={{
            __html: movie.summary || "No summary available",
            }}
        />
        </main>
    );
}

export default MovieDetailsPage;