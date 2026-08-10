const movies = [
  {
    id: 1,
    title: "Interstellar",
    rating: 8.7,
    year: 2014,
    genre: "Sci-Fi"
  },
  {
    id: 2,
    title: "Inception",
    rating: 8.8,
    year: 2010,
    genre: "Sci-Fi"
  },
  {
    id: 3,
    title: "The Dark Knight",
    rating: 9.0,
    year: 2008,
    genre: "Action"
  }
];

function MovieCard({ movie }) {
  function handleFavorite() {
    console.log("Favorite clicked:", movie.title);
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>⭐ {movie.rating}</p>
      <p>{movie.year}</p>
      <p>{movie.genre}</p>

      <button onClick={handleFavorite}>
        Favorite
      </button>
    </div>
  );
}

function App() {
  function handleSearchChange(event) {
    console.log(event.target.value);
  }

  return (
    <main>
      <h1>Movie Discovery</h1>

      <input
        type="text"
        placeholder="Search movies..."
        onChange={handleSearchChange}
      />

      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </main>
  );
}

export default App;
