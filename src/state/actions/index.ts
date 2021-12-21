import { ActionType } from "../action-types/index";
import {IWeatherForecast} from "../../types";

export type searchTypeType = 'city-name' | 'city-id' | 'zip-code';
export type weatherUnitType = 'c' | 'f';

export interface WeatherLoading {
    type: typeof ActionType.WEATHER_LOADING;
}

export interface WeatherError {
    type: typeof ActionType.WEATHER_ERROR;
}

export interface WeatherSuccess {
    type: typeof ActionType.WEATHER_SUCCESS;
    payload: IWeatherForecast;
}

export interface WeatherUnitChange {
    type: typeof ActionType.WEATHER_UNIT_CHANGE;
    payload: 'c' | 'f',
}

export type WeatherDispatchTypes = WeatherLoading | WeatherSuccess | WeatherError | WeatherUnitChange;