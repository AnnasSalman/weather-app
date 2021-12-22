import React, {useState} from 'react';
import WeatherForecastItem from './WeatherForecastItem';
import { AreaChart, Tooltip, Area, XAxis} from 'recharts';

import { IWeatherForecast } from '../types';

type dayGraphData = {
    name: string, 
    temperature: number,
}[]

const getGraphDataFromDailyForecast = (
    list: IWeatherForecast["list"],
    dailyWeather: IWeatherForecast["list"],
    selectedWeatherDayIndex: number
): dayGraphData => {
    const dayTimeline = list.filter(listItem => {
        if(dailyWeather[selectedWeatherDayIndex].dt_txt.includes(listItem.dt_txt.substring(0, 10))){
            return listItem
        }
    });
    return dayTimeline.map(item => {
        return{
            name: new Date(item.dt * 1000).toLocaleString('en-US', { hour: 'numeric', hour12: true }),
            temperature: Math.round(item.main.temp),
        }
    })
}

// Get weekday from a timestamp
const getDayFromUnixTimestamp = (timestamp: number): string => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return  days[new Date(timestamp * 1000).getDay()];
}

// Extract temperature at 15:00 on each day 
const getDailyWeatherFromHourlyWeather = (list: IWeatherForecast["list"]): IWeatherForecast["list"] => {
    const temperaturesEachDay = list.filter((item, index)=>{
        if(item.dt_txt.includes('15:00:00')){
            return item
        }
    });
    const completeTempTimelineForFiveDays = [list[0], ...temperaturesEachDay.slice(-4)];
    return completeTempTimelineForFiveDays;
}

interface IProps{
    list: IWeatherForecast["list"];
    city: IWeatherForecast["city"];
    unit: 'c' | 'f';
    onClick: React.MouseEventHandler<HTMLSpanElement>;
}

const Weather: React.FC<IProps> = ({city, list, unit, onClick}) => {

    const [selectedWeatherDay, setSelectedWeatherDay] = useState(0);
    
    const changeCurrentDay = (day: number): void => {
        setSelectedWeatherDay(day);
    }

    return (
        <>
            <div className="Weather-top">
                <h2>{city.name}, {city.country}</h2>
                <h4>{getDayFromUnixTimestamp(list[selectedWeatherDay].dt)}</h4>
                <h4>{list[selectedWeatherDay].weather[0].main}</h4>
            </div>
            <div className="Weather-mid">
                <div className="Row">
                    <img src={`http://openweathermap.org/img/wn/${getDailyWeatherFromHourlyWeather(list)[selectedWeatherDay].weather[0].icon}@2x.png`} className="Weather-icon" alt="sunny"/>
                    <h1>{Math.round(list[selectedWeatherDay].main.temp)}</h1>
                    <h3>
                        °<span 
                            className={unit === "c" ? "underline" : ""}
                            onClick={onClick}
                        >C</span> | 
                        °<span 
                            className={unit === "f" ? "underline" : ""}
                            onClick={onClick}
                        >F</span> 
                    </h3>
                </div>

                <div className="Col">
                    <h4>Pressure: {list[selectedWeatherDay].main.pressure} hpa</h4>
                    <h4>Humidity: {list[selectedWeatherDay].main.humidity}%</h4>
                    <h4>Wind Speed: {list[selectedWeatherDay].wind.speed} m/s</h4>
                </div>
            </div>
            <AreaChart 
                width={730} 
                height={170} 
                data={getGraphDataFromDailyForecast(
                    list,
                    getDailyWeatherFromHourlyWeather(list),
                    selectedWeatherDay,
                )}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff5cc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fff5cc" stopOpacity={0.3}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="gray" strokeWidth={0} fontSize={14}/>
                <Tooltip />
                <Area type="monotone" dataKey="temperature" stroke="#fd2" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)"/>
            </AreaChart>
            <div className="Weather-bottom">
                {
                    getDailyWeatherFromHourlyWeather(list).map((item, index) => (
                        <WeatherForecastItem 
                            onClick={()=>changeCurrentDay(index)}
                            selected={selectedWeatherDay === index ? true : false} 
                            day={getDayFromUnixTimestamp(item.dt)} 
                            high={Math.round(item.main.temp_max)} 
                            low={Math.round(item.main.temp_min)} 
                            icon={item.weather[0].icon}
                            key={item.dt_txt}
                        />)
                    )
                }
            </div>
        </>
    )
}

export default Weather;