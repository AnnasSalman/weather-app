import { Dispatch } from "redux";
import {ActionType} from "../action-types";
import {WeatherDispatchTypes} from "../actions"
import axios from "axios";

import {searchTypeType, weatherUnitType} from "../actions/index";

export const getWeather = (searchTerm: string, searchType: searchTypeType, weatherUnit: weatherUnitType) => async (dispatch:Dispatch<WeatherDispatchTypes>) => {

    // Maps dropdown name to a function that uses the input to generate a string that can be used for endpoint  
    const dropdownOptionToApiMap = {
        "city-name": (city: string): string => `q=${city}`,
        "city-id": (id: string): string => `id=${id}`,
        "zip-code": (zipCode: string, countryCode: string = 'pk'): string => `zip=${zipCode},${countryCode}`,
    }

    const weatherUnitsDefinitions = {
        c: "metric",
        f: "imperial",
    }

    try{
        dispatch({
            type: ActionType.WEATHER_LOADING,
        })
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?${dropdownOptionToApiMap[searchType](searchTerm)}&appid=c73aa228bfba692462f96e89080aa39a&units=${weatherUnitsDefinitions[weatherUnit]}`);

        dispatch({
            type: ActionType.WEATHER_SUCCESS,
            payload: res.data,
        })
    }
    catch(e){
        dispatch({
            type: ActionType.WEATHER_ERROR,
        })
    }
}

export const changeWeatherUnit = (unit: 'c' | 'f') => (dispatch:Dispatch<WeatherDispatchTypes>) => {
    dispatch({
        type: ActionType.WEATHER_UNIT_CHANGE,
        payload: unit,
    })
}
