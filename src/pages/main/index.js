import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../main/index.css'

export default function Main(props) {

    let [token, setToken] = useState("");
    let [nameArtistSearch, setNameArtistSearch] = useState("")
    let [timeRange, setTimeRange] = useState("medium_term")
    let [offset, setOffset] = useState("1")
    let [limitNumber, setLimitNumber] = useState("20")

    let [userTopSongs, setUserTopSongs] = useState([])
    let [userTopArtists, setUserTopArtists] = useState([])
    let [artistTopTracks, setArtistTopTracks] = useState([])

    let genres = []
    let [artistInfo, newArtistInfo] = useState([])

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
        hideAllDivs()
        showDiv("artistTopTracks")

        let response = await axios.get(`https://api.spotify.com/v1/search?q=${nameArtistSearch}&type=artist&limit=2`, data)
        
        
        var r =response.data.artists.items[0].images[0].url
        console.log(r)
        newArtistInfo([r])

        let artistId = response.data.artists.items[0].id
        let url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=BR`
        response = await axios.get(url, data)
        setArtistTopTracks(response.data.tracks)
    
    }

    function getUserMostArtists() {
        hideAllDivs()
        showDiv("userTopArtists")
        axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limitNumber}&offset=${offset}`, data)
            .then(item => {
                console.log(item.data.items)
                setUserTopArtists(item.data.items)
            })
    }

    function getUserMostPlayedSongs() {
        hideAllDivs()
        showDiv("userTopSongs")
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limitNumber}&offset=${offset}`, data)
            .then(item => {
                console.log(item.data.items)
                setUserTopSongs(item.data.items)
            })
    }

    function hideAllDivs() {
        let divsIds = ["userTopArtists", "artistTopTracks", "userTopSongs"]
        divsIds.map(div => {
            document.getElementById(div).style.display = "none"
        })
    }

    function showDiv(id) {
        document.getElementById(id).style.display = "grid"
    }


    return (

        <div id="container">
            <span id="title">Spotify Favorites</span>
            <span id="subtitle">O que você quer descobrir primeiro? </span>
            <br />

            <ul id="container-block">

                <li id="block" onClick={() => getUserMostPlayedSongs()} >Suas musicas mais tocadas</li>
                <li id="block" onClick={() => getUserMostArtists()} >Seus artistas mais ouvidos</li>
                <li id="block" onClick={() => getArtistTopTracks()}>As <i>top tracks</i> de algum artista</li>
                <li id="block" >Os gêneros que você mais ouve</li>
                <li id="block" >Suas recomendações semanais</li>

            </ul>
            <span id="artistInput">
                Nome do artista: <input value={nameArtistSearch} onChange={e => setNameArtistSearch(e.target.value)} />
            </span>

            <label for="timeRange">Escolha um periodo de tempo:</label>

            <select id="timeRange"
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}>
                
                <option value="medium_term">Padrão (Medium Range)</option>
                <option value="short_term"> Aprox. últimas 4 semanas</option>
                <option value="medium_term">Aprox. últimos 6 meses</option>
                <option value="long_term">Aprox. desde o início da conta</option>
            </select>

            <label for="limitNumber"> Escolha um limite de busca: </label>
            <input id="limitNumber" type="number" min="1" max="50"
                defaultValue="20"
                placeholder="Minímo(1), maxímo(50)"
                value={limitNumber}
                onChange={e => setLimitNumber(e.target.value)}
            />

            <label for="offset">O índice da primeira música retornada: </label>
            <input id="offset" type="number" min="0"
                placeholder="Default (0)"
                defaultValue="0"
                value={offset}
                onChange={e => setOffset(e.target.value)}
            />

            <div id="container_results">

                <div id="userTopSongs">
                    {
                        userTopSongs.map(mostSong => (
                            <li key={mostSong.id}>
                                <a href={mostSong.external_urls.spotify}>
                                    <img alt="eee" src={mostSong.album.images[1].url} />
                                </a>
                                <div>
                                    <span href={mostSong.external_urls.spotify}>
                                        {mostSong.name}</span>
                                    <p> {mostSong.artists[0].name}</p>
                                </div>
                            </li>
                        ))
                    }
                </div>

                <div id="userTopArtists">
                    {
                        userTopArtists.map(top => (
                            <li key={top.id}>
                                <img src={top.images[0].url} alt="" />

                                <div>
                                    <span>{genres.push(top.genres)}# {top.name}</span>
                                </div>
                            </li>
                        )
                        )
                    }
                </div>

                <div id="artistTopTracks">

                    
                        {
                            artistInfo.map(info =>(
                                <div key={info}>
                                <a >
                             
                                    <img src={info} alt="image" alt="artistPic" />
                                </a>
                                <span>{}</span>
                            </div> 
                            ))
                        } 

                    {artistTopTracks.map(song => (
                        <li key={song.id}>

                            <a href={song.external_urls.spotify}>
                                <img src={song.album.images[0].url} alt="yyyy" />
                            </a>

                            <div>
                                <span>{song.name}</span>
                                <p>{song.album.name}</p>
                            </div>

                        </li>
                    ))
                    }
                </div>
            </div>
        </div>
    );
}
