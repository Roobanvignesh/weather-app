import { useEffect, useState } from 'react';
import './App.css';
import cloudyIcon from "./asserts/cloudy-day.png";
import DrizzleIcon from "./asserts/drizzle.png";
import RainIcon from "./asserts/heavy-rain.png";
import HumidityIcon from "./asserts/humidity.png";
import SearchIcon from './asserts/search.png';
import snowyIcon from './asserts/snowy.png';
import clearIcon from './asserts/sun.png';
import windIcon from './asserts/wind.png';

const WeatherDetails = ({icon , temp , city , country , lat , log , humidity , wind}) => {
return(
<>
    <div className="image">
        <img src={icon} alt='image' />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
        <div>
            <span className='lat'>Latitude</span>
            <span>{lat}</span>
        </div>
        <div>
            <span className='log'>Longitude</span>
            <span>{log}</span>
        </div>
    </div>
    <div className="data-container">
        <div className="element">
            <img src={HumidityIcon} alt="humidity" className="icon" />
            <div className="data">
                <div className="humidity-percent">{humidity}%</div>
                <div className="text">Humidity</div>
            </div>
        </div>
        <div className="element">
            <img src={windIcon} alt="wind" className="icon" />
            <div className="data">
                <div className="wind-percent">{wind} Km/h</div>
                <div className="text">Wind Speed</div>
            </div>
        </div>
    </div>
</>
);
};

function App() {
let api_key = "4a666e39d9ac04a835654c50aa6ae737";

const [text, setText] = useState("Theni");
const [icon, setIcon] = useState(DrizzleIcon);
const [temp, setTemp] = useState(0);
const [city, setCity] = useState("");
const [country, setCountry] = useState("");
const [lat, setLat] = useState(0);
const [log, setLog] = useState(0);
const [humidity, setHumidity] = useState(0);
const [wind, setWind] = useState(0);
const [loading, setLoading] = useState(false);
const [cityNotFound, setCityNotFound] = useState(false);
const [error,setError] = useState(null);

const weatherIconMap = {
"01d" : clearIcon,
"01n" : clearIcon,
"02d" : cloudyIcon,
"02n" : cloudyIcon,
"03d" : DrizzleIcon,
"03n" : DrizzleIcon,
"04d" : DrizzleIcon,
"04n" : DrizzleIcon,
"09d" : RainIcon,
"09n" : RainIcon,
"10d" : RainIcon,
"10n" : RainIcon,
"13d" : snowyIcon,
"13n" : snowyIcon,


};

const search = async () => {
setLoading(true);
let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

try{
let res = await fetch(url);
let data = await res.json();
// console.log(data);
if(data.cod === "404"){
console.log("city not found");
setCityNotFound(true);
setLoading(false);
return;
}

setHumidity(data.main.humidity);
setWind(data.wind.speed);
setTemp(Math.floor(data.main.temp));
setCity(data.name);
setCountry(data.sys.country);
setLat(data.coord.lat);
setLog(data.coord.lon);
const weatherIconCode = data.weather[0].icon;
setIcon(weatherIconMap[weatherIconCode] || clearIcon);
setCityNotFound(false);
}catch(error){
console.error("An error occured:", error.message);
setError("an error occured while fetching data");
}finally{
setLoading(false)
}
};
const HandleCity = (e) => {
setText(e.target.value);
};
const handleKeyDown = (e) => {
if(e.key === "Enter"){
search();
}
};
useEffect(function () {
search();
},[]);
return (
<div className="container">
    <div className="input-container">
        <input type="text" placeholder='Enter city name' className='cityInput' onChange={HandleCity} value={text}
            onKeyDown={handleKeyDown} />
        <div className="SearchIcon" onClick={()=> search()} >
            <img src={SearchIcon} alt="Search" height={20} />
        </div>
    </div>
    {loading && <div className="loading-msg">Loading....</div>}
    {error && <div className="error-msg">{error}</div>}
    {cityNotFound && <div className="city-not-found">City not found</div>}

    {!loading && !cityNotFound &&
    <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity}
        wind={wind} />}

    <p className="copyright">Designed by <span>Rooban</span></p>
</div>
);
}

export default App;