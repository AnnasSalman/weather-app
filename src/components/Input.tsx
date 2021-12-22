import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {ReactComponent as SearchIcon} from '../assets/icons/icons8-search.svg';

interface Props{
    onDropdownSelect: (val: string) => void;
    textInputValue: string;
    onTextInputChange: (val: string) => void;
    onSearchClick: () => void;
}

const options = [
    { 
        value: 'city-name',
        label: 'City Name', 
    },
    { 
        value: 'city-id',
        label: 'City id', 
    },
    { 
        value: 'zip-code',
        label: 'Zip Code', 
    },
];

const Input: React.FC<Props> = ({
    onDropdownSelect,
    textInputValue,
    onTextInputChange,
    onSearchClick
}) => {
    return(
        <div className="Input-container">
            <Dropdown 
                options={options} 
                onChange={(val) => onDropdownSelect(val.value)} 
                value={'Search by'}
                placeholder="Select an option" 
            />
            <input 
                type="text"
                placeholder="Search term" 
                className="Text-input"
                value={textInputValue}
                onChange={(val) => onTextInputChange(val.target.value)} 
            />
            <button 
                className="Search-button"
                onClick={onSearchClick}
            >
                <SearchIcon width="20" height="20"/>
            </button>
        </div>
    )
}

export default Input