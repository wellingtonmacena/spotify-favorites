import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function App(props) {
   
  let [token, setToken] = useState("");
  let [songs, setSongs] = useState([])
  let [artista, setArtista] = useState("")
  let [topTracks, setTopTracks] = useState([])
  let [mostPlayedSongs, setMostPlayedSongs] = useState([])

  useEffect(()=>{
    const query = props.location.pathname
    const token = query.split('/')[2];
    setToken(token)


  },[props.location.pathname])

  const data = {
    headers : {
       "Accept": "application/json",
       "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`
   }}


  async function getArtistTopTracks(idArtist) {

    let url = `https://api.spotify.com/v1/artists/${artista}/top-tracks?country=BR`   
    
    
    const response = await axios.get(url, data)
    console.log(response.data.tracks)
    setSongs(response.data.tracks)   
  }

   function getMostArtists(){
    axios.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=30&offset=5", data)
    .then(item =>{
      console.log(item.data)
      setTopTracks(item.data.items)
    })

  }

  function getMostPlayedSongs(){
    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=20",data)
    .then(item =>{
      console.log(item.data.items)
      setMostPlayedSongs(item.data.items)
    })
  }
  return (
    
    <div className="App">
        Nome do artista: <input value ={artista} onChange={e => setArtista(e.target.value)} /> 
      <button onClick={() => getArtistTopTracks(artista)}>Get Toptracks artist</button>

    <button onClick={()=> getMostArtists()}>Get your most played artists</button>

    <button onClick={()=> getMostPlayedSongs()}>Get your most played songs</button>
      

    <ul>
      {
        songs.map(song =>(
          <li key={song.id}>
            {song.name} -# {song.album.name}
          </li>
        ))
      }
    </ul>

  <ul>
    {
       topTracks.map(top =>(
         <li key={top.id}>
           {top.name}
         </li>
         
       )
     )
    }
  </ul>

  <ul>
    {
      mostPlayedSongs.map(mostSong =>(
        <li key={mostSong.id}>
          {mostSong.name}--BY: {mostSong.artists[0].name} 
           <img src={mostSong.album.images[2].url}/>

        </li>
      ))
    }
  </ul>
    
    </div>
    

  );
}

export default App ;
