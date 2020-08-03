import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../main/index.css'

export default function Main(props) {

    let [token, setToken] = useState("");
    let [idArtistSearch, setIdArtistSearch] = useState("")
    let [timeRange, setTimeRange] = useState("")
    let [offset, setOffset] = useState("1")
    let [limitNumber, setLimitNumber] = useState("20")

    let [userTopSongs, setUserTopSongs] = useState([])
    let [userTopArtists, setUserTopArtists] = useState([])
    let [artistTopTracks, setArtistTopTracks] = useState([])

    useEffect(() => {
        const query = props.location.pathname
        const token = query.split('/')[2];
        setToken(token)
    }, [props.location.pathname])

    const data = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    async function getArtistTopTracks() {
        let url = `https://api.spotify.com/v1/artists/${idArtistSearch}/top-tracks?country=BR`
        const response = await axios.get(url, data)
        console.log(response.data.tracks)
        setArtistTopTracks(response.data.tracks)
    }

    function getUserMostArtists() {
        axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=${limitNumber}&offset=${offset}`, data)
            .then(item => {
                console.log(item.data)
                setUserTopArtists(item.data.items)
            })
    }

    function getUserMostPlayedSongs() {
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=${limitNumber}&offset=${offset}`, data)
            .then(item => {
                console.log(item.data.items)
                setUserTopSongs(item.data.items)
            })
    }


    return (

        <div id="container">
            <h1 id="title">Spotify Favorites</h1>
            <span id="subtitle">O que você quer descobrir primeiro? </span>
            <br />

            <ul id="container-block">

                <li id="block" onClick={() => getUserMostPlayedSongs()}  >Suas musicas mais tocadas</li>
                <li id="block" onClick={() => getUserMostArtists()} >Seus artistas mais ouvidos</li>
                <li id="block" onClick={() => getArtistTopTracks()}>As <i>top tracks</i> de algum artista</li>
                <li id="block" >Os gêneros que você mais ouve</li>
                <li id="block" >Suas recomendações semanais</li>

            </ul>
            <span id="artistInput">
                Nome do artista: <input value={idArtistSearch} onChange={e => setIdArtistSearch(e.target.value)} />
            </span>

            <label for="timeRange">Choose a time range:</label>

            <select id="timeRange">
                <option value="medium_term">Default (Medium Range)</option>
                <option value="short_term">Short Range</option>
                <option value="medium_term">Medium Range</option>
                <option value="long_term">Long Range</option>
            </select>

            <label for="limitNumber"> Choose a limit number of songs: </label>
            <input id="limitNumber" type="number" min="1" max="50"
                defaultValue="20"
                placeholder="Minimum(1), Maximum(50)"
                value={limitNumber}
                onChange={e => setLimitNumber(e.target.value)}
            />

            <label for="offset">The index of the first track to return: </label>
            <input id="offset" type="number" min="1"
            placeholder="Default (0)"
            defaultValue="0"
            value={offset} 
            onChange={e => setOffset(e.target.value)}
            />


            <ul id="artistTopTracks">
                {
                    artistTopTracks.map(song => (
                        <li key={song.id}>
                            {song.name} -# {song.album.name}
                        </li>
                    ))
                }
            </ul>

            <ul id="userTopArtists">
                {
                    userTopArtists.map(top => (
                        <li key={top.id}>
                            {top.name}
                        </li>
                    )
                    )
                }
            </ul>

            <ul id="userTopSongs">
                {
                    userTopSongs.map(mostSong => (
                        <li key={mostSong.id}>
                            {mostSong.name} -- BY: {mostSong.artists[0].name}
                            <img alt="eee" src={mostSong.album.images[2].url} />
                        </li>
                    ))
                }
            </ul>

        </div>
    );
}

