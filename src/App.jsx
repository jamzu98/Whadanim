import React, { useState } from 'react';
import { searchAnime, showRecommendations } from './services/api';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const searchAnimeHandler = async (event) => {
    event.preventDefault();
    setError('');
    const data = await searchAnime(query);
    setResults(data);
  };

  const showRecommendationsHandler = async (id) => {
    setError('');
    const data = await showRecommendations(id);
    setRecommendations(data);
    setIsModalOpen(true);
  };

  const AnimeItem = React.memo(({ anime, onClick, hideDetails }) => (
    <div
      key={anime.mal_id}
      className={`w-64 min-h-96 flex flex-col items-center bg-white p-4 rounded-md shadow-md transform transition duration-300 hover:bg-gray-100 hover:scale-105 ${
        hideDetails ? 'h-auto' : 'h-80'
      }`}
    >
      <a href={anime.url} target="blank">
        <p className="mt-2 font-bold text-center">
          {anime.title} {!hideDetails && `(${anime.year || `???`})`}
        </p>
      </a>
      <img
        src={anime.images.webp.image_url}
        alt={anime.title}
        className="w-48 h-48 rounded-md object-cover hover:cursor-pointer"
        onClick={onClick}
      />
      {!hideDetails && (
        <p className="font-semibold">Rating: {anime.score || `N/A`}</p>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col items-center pt-5 pb-5">
      <h1 className="text-palette-red font-bold text-3xl mb-5">WHADANIM</h1>
      <form onSubmit={searchAnimeHandler} className="flex">
        <input
          type="text"
          placeholder="Search anime"
          onChange={(event) => setQuery(event.target.value)}
          className="border rounded-l px-4 py-2"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-palette-blue hover:bg-palette-light-blue text-white rounded-r px-4 py-2 transition duration-300 ease-in-out hover:shadow-md active:bg-blue-800"
        >
          Search
        </button>
      </form>
      {error && <p className="text-palette-red font-semibold mt-2">{error}</p>}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((anime) => (
          <AnimeItem
            key={anime.mal_id}
            anime={anime}
            onClick={() => showRecommendationsHandler(anime.mal_id)}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md max-w-auto max-h-80 overflow-auto px-10">
            <button
              className="text-palette-red font-bold float-right"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
            <h2 className="text-center font-bold mb-4">Recommendations</h2>
            {recommendations.length === 0 ? (
              <p className="text-center text-palette-red font-semibold">
                Sorry, we couldn't find any recommendations for the selected
                title.
              </p>
            ) : (
              <div className="grid pb-4 pt-4 grid-cols-1 sm:grid-cols-2 gap-8 overflow-hidden">
                {recommendations.map((anime) => (
                  <AnimeItem
                    key={anime.mal_id}
                    anime={anime}
                    onClick={() => {
                      setIsModalOpen(false);
                      showRecommendationsHandler(anime.mal_id);
                    }}
                    hideDetails={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
