import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../main/index.css'
import { Chart } from 'chart.js'
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
    let mostGenres = []
    let [artistInfo, newArtistInfo] = useState([])

    let [firstData, setfirstData] = useState([]);
    let [secondData, setSecondData] = useState([])
    let [thirdData, setThirdData] = useState([])
    let [forthData, setForthData] = useState([]);
    let [fifthData, setFifthData] = useState([]);

    useEffect(() => {
        const query = props.location.pathname
        const token = query.split('/')[2];
        setToken(token)
    }, [props.location.pathname])

    useEffect(() => {

    }, [firstData ])

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

        var r = response.data.artists.items[0].images[0].url
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
        let divsIds = ["userTopArtists", "artistTopTracks", "userTopSongs", "myChart"]
        divsIds.map(div => {
            document.getElementById(div).style.display = "none"
        })
    }

    function showDiv(id) {
        document.getElementById(id).style.display = "grid"
    }

    function gopush() {
        var mf = 1;
        var m = 0;
        var item;
        for (var i = 0; i < mostGenres.length; i++) {
            for (var j = i; j < mostGenres.length; j++) {
                if (mostGenres[i] == mostGenres[j])
                    m++;
                if (mf < m) {
                    mf = m;
                    item = mostGenres[i];
                }
            }
            m = 0;
        }

        var indexToRemove = []
        for (let elem of mostGenres) {
            if (elem === item) {
                indexToRemove.push(indexToRemove.indexOf(elem))
            }
        }
        for (var index = 0; index < mostGenres.length; index++) {

            if (mostGenres[index] === item) {
                delete mostGenres[index]
            }
        }
        mostGenres = mostGenres.filter(item => item !== undefined)
        return [item, mf]
    }

    function capitalizeString(string) {
        var word = ""
        for (var index = 0; index < string.length; index++) {
            if (index == 0) {
                word += string[0].toUpperCase()

            }
            else {
                word += string[index]
            }
        }
        return word
    }


    function findMostListenedGenre() {
        hideAllDivs()
        var dataChart = {}
        genres.map(item => item.map(ele => mostGenres.push(ele)))
        console.log(mostGenres)

        if (genres.length > 0) {
            document.getElementById("myChart").style.display = "none"
            showDiv("myChart")
            var backGroundColors = ['rgba(252, 98, 98)', 'rgba(255, 201, 54)', 'rgba(235, 255, 54)',
                'rgba(165, 255, 54)', 'rgba(206, 237, 168)']

             setfirstData([gopush()[0], gopush()[1]]);
             console.log(firstData)
             console.log(firstData[1])
             setSecondData(gopush());
             setThirdData(gopush());
             setForthData(gopush());
             setFifthData(gopush());
            
           
          

                // These labels appear in the legend and in the tooltips when hovering different arcs
                   // capitalizeString(firstData[0]),
                    // capitalizeString(secondData[0]),
                    // capitalizeString(thirdData[0]),
                    // capitalizeString(forthData[0]),
                    // capitalizeString(fifthData[0]),
                
        
            sendChart(dataChart)


            genres = []
            mostGenres = []
        }
    }


    function sendChart(dataChart) {

        var myChart = new Chart("myChart", {
            data: dataChart,
            type: 'bar',
            options: {
                title: {
                    display: true,
                    text: 'Generos mais ouvidos',
                    fontColor: "#fff"
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'rgb(155, 242, 174)'
                    }
                }
            }
        });
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
                <li id="block" onClick={() => findMostListenedGenre()} >Os gêneros que você mais ouve</li>
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
                        artistInfo.map(info => (
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

                <canvas id="myChart">
                </canvas>
            </div>
        </div>
    );
}
