import React, {useState} from 'react';
import './App.css';

import Header from './components/PageHeader';
import Input from './components/Input';
import Weather from './components/Weather';

import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from './state';
import { RootState } from './state/reducers';

import Loader from "react-loader-spinner";
import {ReactComponent as ErrorIcon} from './assets/icons/undraw_cancel.svg';



interface IState{
  form: {
    searchType: 'city-name' | 'zip-code' | 'city-id' | '';
    searchText: string;
    unit: 'c' | 'f';
  }
}

function App() {

  const state = useSelector((state: RootState) => state.weather);
  const loading = useSelector((state: RootState) => state.weather.loading);
  const error = useSelector((state: RootState) => state.weather.error);
  const [errorText, setErrorText] = useState(''); 
  const dispatch = useDispatch();

  const { getWeather, changeWeatherUnit } = bindActionCreators(actionCreators, dispatch)

  const [form, setForm] = useState<IState["form"]>({
    searchType: '',
    searchText: '',
    unit: 'c',
  })

  const setFormState = (val: string, key: string) : void => {
    setForm({
      ...form,
      [key]: val,
    })
  }

  // if all inputs exist, fetch weather else show error
  const onSearchClick = (): void => {
    if(form.searchType && form.searchText){
      getWeather(form.searchText, form.searchType, form.unit);
      setErrorText('');
    }
    else{
      setErrorText('Please select search type and search term before continuing')
    }
  }

  // Change all temperature values according to the changed unit.
  const onUnitChange = (unit: string): void => {
    if(unit === 'c' || unit === 'f'){
      setForm({...form, unit})
      changeWeatherUnit(unit);
    }
  }

  return (
    <div className="App">
      <Header/>
      <Input 
        onDropdownSelect={(val) => setFormState(val, 'searchType')}
        textInputValue={form.searchText}
        onTextInputChange={(val) => setFormState(val, 'searchText')}
        onSearchClick={onSearchClick}
      />
      <div>{errorText}</div>
      <div className="Body">
        {
          loading 
          ? <div className="Loading-indicator">
              <Loader
                type="MutatingDots"
                color='purple'
                secondaryColor='gray'
                height={100}
                width={100}
                timeout={20000}
              />
            </div> 
          : error
          ? <div className="Loading-indicator">
              <ErrorIcon width={300} height={250}/>
              <h2>Error Loading Weather</h2>
            </div> 
          : state.weather
          ? <Weather
              list={state.weather.list}
              city={state.weather.city}
              unit={form.unit}
              onClick={(e) => onUnitChange(e.currentTarget.innerText.toLowerCase())}            
            />
          : null
        }
      </div>
    </div>
  );
}

export default App;
