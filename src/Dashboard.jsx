import { useState } from 'react';
import { spotifyAPI } from './api/spotifyAPI';
import './Dashboard.css'; 

const Dashboard = () => {
  const selectTypes = [
    'album',
    'artist',
    'playlist',
    'track',
    'show',
    'episode',
    'audiobook',
  ];
  const [search, setSearch] = useState({
    song: '',
    types: '',
  });

  const [deviceId, setDeviceId] = useState()
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);


  const handleAddFavorite = (item) => {
    console.log(item)
    const isAlreadyFav = favorites.some((fav) => fav.uri === item.uri);

    if (isAlreadyFav) {
      console.log('Item already in favorites');
      setFavorites((prev) => prev.filter((el) => el.uri !== item.uri));
    } else {
      setFavorites((prev) => [...prev, item]);
    }
  }

  const handleChange = (e) => {

    const {value, name} = e.target;
    const newFom = {
        ...search,
        [name]: value,
    }
    console.log(newFom);
    setSearch(newFom);
  }

  const createFavs = async (favorites) => {
    console.log(favorites);
    const userId = 2
    const url = `http://localhost:3000/api/users/${userId}/favorites`;

    const data = {
      items: favorites,
    }
    const result = await spotifyAPI(url, 'POST', JSON.stringify(data), null);
    console.log("ya se guardaron los favoritos", result);
  }

  const saveFavs = async() => {
    await createFavs(favorites);
  }

  const handleSearch = async () => {
    const params = new URLSearchParams();

    params.append('q', encodeURIComponent(`remaster track:${search.song}`));
    params.append('type', search.types);

    const queryString = params.toString();
    const url = 'https://api.spotify.com/v1/search';

    const updateUrl = `${url}?${queryString}`;
    const token = localStorage.getItem('access_token');

    const response = await spotifyAPI(updateUrl, 'GET', null, token);
    
    setResults(response.tracks.items)
  };

  const getDeviceId = async() => {
    const token = localStorage.getItem('access_token')
    const url = "https://api.spotify.com/v1/me/player/devices";
    const response = await spotifyAPI(url, 'GET', null, token)

    console.log(response)
    setDeviceId(response.devices[0].id)
  }
  
  const handlePlay = async(song) => {
    const token = localStorage.getItem('access_token')
    const data = {
      uris: [song]
    }
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
    const play = await spotifyAPI(url, 'PUT', JSON.stringify(data), token)
    console.log(play)
  }

  return (
    <>
      <div className="Dashboard">
      < button onClick={getDeviceId}>GET DEVICE ID</button>
        <button onClick={saveFavs}>SAVE FAVS</button>
        <p>Search</p>
        <input
          name="song"
          type="text"
          value={search.song}
          onChange={handleChange}
        />
        <p>Select Types:</p>
        <select name="types" value={search.types} onChange={handleChange} >
          {selectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results-container">
        {results.map((result, idx) => (
          <div className="result-card" key={idx}>
            <img src={result.album.images[0].url} width={150} />
            <p>{result.name}</p>
            <p>{result.artists[0].name}</p>
            <div className="actions">
              <button onClick={() => handlePlay(result.uri)}>Play</button>
              <button onClick={() => handleAddFavorite(result)}>Add favorite</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;