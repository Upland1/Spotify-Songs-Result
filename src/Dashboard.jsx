import { useState } from "react";
import { spotifyAPI } from "./api/spotifyAPI";
import "./Dashboard.css";

const Dashboard = () => {
  const selectTypes = [
    "album",
    "artist",
    "playlist",
    "track",
    "show",
    "episode",
    "audiobook",
  ];

  const [search, setSearch] = useState({ song: "", types: "" });
  const [deviceID, setDeviceID] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedFavorites, setSavedFavorites] = useState([]);

  const getAccessToken = () => localStorage.getItem("access_token");

  const handleChange = (e) => {
    const { value, name } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    params.append("q", encodeURIComponent(`remaster track:${search.song}`));
    params.append("type", search.types);

    const url = `https://api.spotify.com/v1/search?${params.toString()}`;
    const token = getAccessToken();
    const response = await spotifyAPI(url, "GET", null, token);

    if (response && response.tracks) {
      setResults(response.tracks.items);
    }
  };

  const getDeviceId = async () => {
    const token = getAccessToken();
    const url = "https://api.spotify.com/v1/me/player/devices";
    const response = await spotifyAPI(url, "GET", null, token);

    if (response?.devices?.[0]?.id) {
      console.log(response.devices[0].id);
      setDeviceID(response.devices[0].id);
    }
  };

  const handlePlay = async (song) => {
    const token = getAccessToken();
    const data = { uris: [song] };
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`;
    const play = await spotifyAPI(url, "PUT", JSON.stringify(data), token);
    console.log(play);
  };

  const handleAddFavorite = (favorite) => {
    const isAlreadyFav = favorites.some((fav) => fav.id === favorite.id);
    if (isAlreadyFav) {
      console.log("Ya estaba en favs");
      setFavorites((prev) => prev.filter((el) => el.id !== favorite.id));
    } else {
      setFavorites((prev) => [...prev, favorite]);
    }
  };

  const createFavs = async (favs) => {
    const url = "http://localhost:3000/favorites";

    const simplifiedItems = favs.map((track) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      album: track.album?.name,
      albumImage: track.album?.images?.[0]?.url || null,
      artists: track.artists?.map((a) => a.name),
      href: track.href,
      duration_ms: track.duration_ms,
    }));
    

    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ items: simplifiedItems }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HTTP ${response.status} - ${error.error}`);
      }

      const result = await response.json();
      console.log("Favoritos guardados:", result);
    } catch (error) {
      console.error("Error al guardar favoritos:", error.message);
    }
  };

  const saveFavs = () => {
    createFavs(favorites);
  };

  const getSavedFavorites = async () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(`HTTP ${response.status} - ${errorRes.error}`);
      }

      const data = await response.json();
      console.log("Favoritos obtenidos:", data);
      setSavedFavorites(data);
    } catch (error) {
      console.error("Error al obtener favoritos:", error.message);
    }
  };

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>

      <div className="controls">
        <button onClick={getDeviceId}>GET DEVICE ID</button>
        <button onClick={saveFavs}>SAVE FAVS</button>
        <button onClick={getSavedFavorites}>GET FAVS</button>
      </div>

      <div className="search-section">
        <p>Search</p>
        <input
          name="song"
          type="text"
          value={search.song}
          onChange={handleChange}
        />
        <p>Select Types:</p>
        <select name="types" value={search.types} onChange={handleChange}>
          {selectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {results.map((result, idx) => (
        <div key={idx} className="song-result">
          <img
            src={result.album.images[0]?.url}
            width={150}
            alt="Album cover"
          />
          <div style={{ marginLeft: "1rem" }}>
            <p>{result.name}</p> {/* nombre de la canción */}
            <p>{result.album?.name || "Álbum desconocido"}</p>
            <p>
              {result.artists?.map((a) => a.name).join(", ") ||
                "Artista desconocido"}
            </p>
            <button onClick={() => handlePlay(result.uri)}>Play</button>
            <button onClick={() => handleAddFavorite(result)}>
              Add Favorite
            </button>
          </div>
        </div>
      ))}

      <h2>Favoritos guardados</h2>
      {savedFavorites.length === 0 ? (
        <p>No hay favoritos guardados aún.</p>
      ) : (
        savedFavorites.flatMap((favGroup, groupIdx) =>
          favGroup.items.map((fav, idx) => (
            <div key={`${groupIdx}-${idx}`} className="song-result">
              {fav.albumImage && (
                <img src={fav.albumImage} width={150} alt="Album cover" />
              )}
              <div style={{ marginLeft: "1rem" }}>
                <p>
                  <strong>{fav.name}</strong>
                </p>
                <p>Álbum: {fav.album}</p>
                <p>Artistas: {fav.artists?.join(", ")}</p>
                <a href={`https://open.spotify.com/track/${fav.id}`} target="_blank" rel="noopener noreferrer">
                  Ver en Spotify
                </a>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default Dashboard;
