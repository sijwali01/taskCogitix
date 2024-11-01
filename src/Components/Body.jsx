import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";


const Body = () => {
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage] = useState(12);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const episodeResponse = await fetch("https://rickandmortyapi.com/api/episode");
        const characterResponse = await fetch("https://rickandmortyapi.com/api/character");

        if (!episodeResponse.ok || !characterResponse.ok) throw new Error("Failed to fetch data.");

        const episodesData = await episodeResponse.json();
        const charactersData = await characterResponse.json();

        setEpisodes(episodesData.results);
        setCharacters(charactersData.results);
        setDisplayedCharacters(charactersData.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEpisodeCharacters = async () => {
      if (selectedEpisode) {
        setLoading(true);
        try {
          const characterResponses = await Promise.all(selectedEpisode.characters.map((url) => fetch(url)));
          const characterData = await Promise.all(characterResponses.map((res) => res.json()));
          setDisplayedCharacters(characterData);
          setCurrentPage(1);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setDisplayedCharacters(characters);
      }
    };

    fetchEpisodeCharacters();
  }, [selectedEpisode, characters]);

  const paginatedCharacters = displayedCharacters.slice(
    (currentPage - 1) * charactersPerPage,
    currentPage * charactersPerPage
  );

  const totalPages = Math.ceil(displayedCharacters.length / charactersPerPage);

  return (
    <div className={`container-fluid ${selectedEpisode ? "episode-page" : "landing-page"}`}>
      <div className="row">
        <div className="col-md-3 sidenav">
          <h3 className="text-center">Episodes</h3>
          {loading && <Spinner animation="border" />}
          {error && <p className="error-text">Error fetching data: {error}</p>}
          {episodes.length === 0 && !loading && <p>No episodes available.</p>}
          <ul className="list-group">
            {episodes.map((episode) => (
              <li
                className="list-group-item text-center episode-item"
                key={episode.id}
                onClick={() => setSelectedEpisode(episode)}
              >
                {episode.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-8 main-container">
          {selectedEpisode && (
            <h4 className="text-center">
              {displayedCharacters.length} Characters in Episode {selectedEpisode.name}
            </h4>
          )}
          <div className="row">
            {loading ? (
              <div className="text-center w-100">
                <Spinner animation="border" />
              </div>
            ) : (
              paginatedCharacters.map((character) => (
                <div className="col-md-4 mb-3" key={character.id}>
                  <Card className="h-100 character-card">
                    <Card.Img variant="top" src={character.image} />
                    <Card.Body>
                      <Card.Title>{character.name}</Card.Title>
                      <Card.Text>
                        {character.species} - {character.status}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))
            )}
          </div>

          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <span className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</span>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <span className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</span>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <span className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Body;
