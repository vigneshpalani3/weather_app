import { useEffect, useState } from 'react'
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import './app.css'

// images
import searchIcon from './assets/search.png'
import brokenIcon from './assets/broken-clouds.png';
import rainyIcon from './assets/rainy.png'
import clearIcon from './assets/clear.png'
import drizzleIcon from './assets/drizzle.png'
import humidityIcon from './assets/humidity.png'
import snowyIcon from './assets/snowy.png'
import windIcon from './assets/wind.png'
import fewCloudsIcon from './assets/few-clouds.png';
import mistIcon from './assets/mist.png';
import scatterIcon from './assets/scatter-clouds.png';
import thunderIcon from './assets/thunder-strom.png'

function WeatherDetail({icon,temp,city,country,log,lat,wind,humidity}){
  return (
    <>
    <div className="image">
      <img src={icon} alt="image" />
    </div>
    <div className="temp">{temp}&deg;C</div>
    <div className="city">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">longitude</span>
        <span>{log}</span>
      </div>
    </div>
      <div className="other-detail">
        <div className="humidity">
          <img src={humidityIcon} alt="" />
          <h3>{humidity}%</h3>
          <h4>Humidity</h4>
        </div>
        <div className="wind">
          <img src={windIcon} alt="" />
          <h3>{wind}km/h</h3>
          <h4>Wind Speed</h4>
        </div>
      </div>
    </>
  );
}


function App() {

  const [search,setSearch] = useState('chennai');
  const [icon,setIcon] =useState(clearIcon);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState('chennai');
  const [country,setCountry] = useState(null);
  const [lat,setLat] = useState(0);
  const [log,setLog] = useState(0);
  const [wind,setWind] =  useState(0);
  const [humidity,setHumidity] =useState(0);
  const [loading,setLoading] = useState(false);
  const [notFound,setNotFound] = useState(false);
  const weatherIconMap={
    '01d':clearIcon,
    '01n':clearIcon,
    '02d':fewCloudsIcon,
    '02n':fewCloudsIcon,
    '03d':scatterIcon,
    '03n':scatterIcon,
    '04d':brokenIcon,
    '04n':brokenIcon,
    '09d':drizzleIcon,
    '09n':drizzleIcon,
    '10d':rainyIcon,
    '10n':rainyIcon,
    '11d':thunderIcon,
    '11d':thunderIcon,
    '13d':snowyIcon,
    '13n':snowyIcon,
    '50d':mistIcon,
    '50n':mistIcon
  }

  async function fetchData(){
    const apiKey = '5d7d488ef61e04bb690d726f08c12828';
    const  url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=Metric`;
    try{
      setLoading(true);
      const responce = await fetch(url);
      const data = await responce.json();
      if(data.cod==='404'){
        console.log('error :'+data.code);
        setLoading(false);
        setNotFound(true);
      }else{
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLog(data.coord.lon);
        console.log(data.weather[0].icon);
        setIcon(weatherIconMap[data.weather[0].icon]);
        setNotFound(false);
      }
    }catch(err){
      console.log(err.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <>
    <div className='container'>
    <div className="input-container">
      <input type="text"
      className="cityInput"
      placeholder='Search city'
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      onKeyDown={e=>e.key==='Enter' && fetchData()}
      />
      <div className="search-icon"
        onClick={fetchData}
      >
        <img src={searchIcon} alt="search" />
      </div>
    </div>
    { loading ? (<Loader />):
    notFound ? (<ErrorMessage />) :
    (
    <WeatherDetail
        icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        log={log}
        wind={wind}
        humidity={humidity}
      />
    )
    }
  </div>
  </>
  );
}

export default App
