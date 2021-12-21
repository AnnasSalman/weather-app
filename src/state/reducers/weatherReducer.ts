import { ActionType } from "../action-types/index";
import {IWeatherForecast} from "../../types"
import {WeatherDispatchTypes} from "../actions"

interface IState{
    weather?: IWeatherForecast;
    error: string;
    loading: boolean;
}

const temperatureUnitSwitch = (toUnit: 'c' | 'f', temperatureValue: number): number => {
  if(toUnit === 'c'){
    return (temperatureValue - 32) * (5/9);
  }
  else{
    return (temperatureValue * (9/5)) + 32;
  }
}

const initialState: IState = {error: '', loading: false};

const reducer = (state: IState = initialState, action: WeatherDispatchTypes): IState => {
    switch(action.type) {
        case ActionType.WEATHER_SUCCESS: 
          return {
            ...state,
            weather: action.payload,
            error: '',
            loading: false,                         
          }
        case ActionType.WEATHER_LOADING:
          return {
            ...state,
            loading: true,
            error: '',
          }
        case ActionType.WEATHER_ERROR:
          return {
            ...state,
            loading: false,
            error: 'Error Loading Weather Data',
          }
        case ActionType.WEATHER_UNIT_CHANGE:
          if(state.weather){
            const weatherListUpdated = state.weather.list.map((weatherTimeElement)=>{
              return{
                ...weatherTimeElement,
                main: {
                  ...weatherTimeElement.main,
                  temp: temperatureUnitSwitch(action.payload, weatherTimeElement.main.temp),
                  ["temp_min"]: temperatureUnitSwitch(action.payload, weatherTimeElement.main["temp_min"]),
                  ["temp_max"]: temperatureUnitSwitch(action.payload, weatherTimeElement.main["temp_max"]),
                }
              }
            });
            return {
              ...state,
              weather: {
                ...state.weather,
                list: [...weatherListUpdated],
              }
            }
          }
          else{
            return state;
          }
        default:
          return state
    }
}

export default reducer;