import React from 'react';
import {IWeatherForecast} from '../types';

type Props = {
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined
    selected: boolean;
    day: string;
    high: number;
    low: number;
    icon: string;
}



const WeatherForecastItem: React.FC<Props> = ({selected, high, low, icon, day, onClick}) => {
    return(
        <div className={`Weather-forecast-item${selected ? ' selected' : ''}`} onClick={onClick}>
            <h4>{day}</h4>
            <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} className="Weather-icon" alt="sunny"/>
            <h4><span className="bold">{high}°</span> {low}°</h4>
        </div>
    )
}

export default WeatherForecastItem;
