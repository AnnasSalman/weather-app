let weatherData = {};

const getDayFromUnixTimestamp = (timestamp) => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return  days[new Date(timestamp * 1000).getDay()];
}

// Extract temperature at 15:00 on each day 
const getDailyWeatherFromHourlyWeather = (list) => {
    return list.filter((item)=>{
        if(item.dt_txt.includes('15:00:00')){
            return item
        }
    });
}

// Maps dropdown name to a function that uses the input to generate a string that can be used for endpoint  
const dropdownOptionToApiMap = {
    "city-name": city => `q=${city}`,
    "city-id": id => `id=${id}`,
    "zip-code": (zipCode, countryCode = 'pk') => `zip=${zipCode},${countryCode}`,
}

// Used to request weather data and use the result to render different portions of the page 
const requestData = (searchType, searchTerm, selectedWeatherDayIndex, unit = 'metric') => {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?${dropdownOptionToApiMap[searchType](searchTerm)}&appid=c73aa228bfba692462f96e89080aa39a&units=${unit}`,
     function(data){
        renderInfoText('');
        weatherData = data;
        renderWeather(data, selectedWeatherDayIndex, unit);
        renderWeatherForecast(data, selectedWeatherDayIndex, unit);
        renderChart(data, selectedWeatherDayIndex);
        console.log(data);
    }).fail(function(error){
        renderInfoText('Unable to load weather data for given location')
    });
}

// event handler for the search button 
$("#search-button").click(() => {
    const searchTerm = $('#search-term-input').val();
    const searchType = $('#search-by').find(":selected").val()
    if(searchTerm && searchType){
        renderInfoText('LOADING...')
        requestData(searchType, searchTerm, 0);
    }
    else{
        renderInfoText('Please enter the search term and search type before continuing');
    }
});

// event handler for the units 
const onUnitClick = (unit, dayIndex) => {
    const searchTerm = $('#search-term-input').val();
    const searchType = $('#search-by').find(":selected").val();
    requestData(searchType, searchTerm, dayIndex, unit);
}

// displays the desired text under the input field
renderInfoText = (val) => {
    $('#info-text').text(val);
}

/* renders complete weather (including the selected days weather and chart)
 Called when a user click a day from the list of forecasts*/
renderWeatherDay = (index, unit) => {
    renderWeather(weatherData, index, unit);
    renderWeatherForecast(weatherData, index, unit);
    renderChart(weatherData, index);
};

// renders a list of weather forcast elements
const renderWeatherForecast = (data, dayIndex, unit) => {
    const {list} = data;
    
    const weatherDays = getDailyWeatherFromHourlyWeather(list);

    weatherDays.forEach((weatherDayItem, index)=>{
        $(".weather-body-bottom").append(`
            <div class="weather-day-item ${dayIndex === index ? 'weather-day-selected' : ''}" onclick="renderWeatherDay(${index}, '${unit}')">
                <p>${getDayFromUnixTimestamp(weatherDayItem.dt)}</p>
                <img src="http://openweathermap.org/img/wn/${weatherDayItem.weather[0].icon}@2x.png"/>
                <p>${Math.round(weatherDayItem.main.temp_max)}° ${Math.round(weatherDayItem.main.temp_min)}°</p>
            </div>
        `)
    })
} 

// renders the top most portion of the weather
const renderWeather = (data, dayIndex, selectedUnit) => {
    let {city, list} = data;
    list = getDailyWeatherFromHourlyWeather(list);
    $(".weather-body").html(`
        <h2>${city.name}, ${city.country}</h2>
        <h4>${getDayFromUnixTimestamp(list[dayIndex].dt)}</h4>
        <h4>${list[dayIndex].weather[0].main}</h4>
        <div class="weather-body-mid">
            <div class="weather-body-mid-temp">
                <img src="http://openweathermap.org/img/wn/${list[dayIndex].weather[0].icon}@2x.png"/>
                <h1>${Math.round(list[dayIndex].main.temp)}</h1>
                <div>
                    <h5>
                        <span 
                            class="weather-unit ${selectedUnit==='metric' ? 'weather-unit-selected' : ''}" 
                            onclick="onUnitClick('metric', ${dayIndex})"
                        >
                            °C
                        </span> 
                        |
                         <span 
                            onclick="onUnitClick('imperial', ${dayIndex})"
                            class="weather-unit ${selectedUnit==='imperial' ? 'weather-unit-selected' : ''}"
                        >
                            °F
                        </span>
                    </h5>
                </div>
            </div>
            <div class="weather-body-mid-details">
                <p>Pressue: ${Math.round(list[dayIndex].main.pressure)}hPa</p>
                <p>Humidity: ${Math.round(list[dayIndex].main.humidity)}%</p>
                <p>Wind Speed: ${Math.round(list[dayIndex].wind.speed)} ${selectedUnit === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
        </div>
        <canvas id="myChart"></canvas>
        <div class="weather-body-bottom">
            
        </div>
    `);    
}

// renders the complete chart
const renderChart = (data, selectedWeatherDayIndex) => {

    // extract only the required days weather from all weather forcasts array  
    const dailyWeather = getDailyWeatherFromHourlyWeather(data.list);
    const chartData = data.list.filter(listItem => {
        if(dailyWeather[selectedWeatherDayIndex].dt_txt.includes(listItem.dt_txt.substring(0, 10))){
            return listItem;
        }
    });

    // New array the consists of the temperatures of the required day
    const temperaturesTimeline = chartData.map(item => Math.floor(item.main.temp));

    new Chart("myChart", {
    type: "line",
    data: {
        labels: chartData.map(item => new Date(item.dt*1000).toLocaleString('en-US', { hour: 'numeric', hour12: true })),
        datasets: [{
        data: temperaturesTimeline,
        borderColor: "#fbcc23",
        backgroundColor: "rgba(251,204,35,0.3)",
        fill: true,
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {display: false},
        scales: {
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    display: false,
                },
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    display: false, //this will remove only the label
                    max: Math.max(...temperaturesTimeline) + 40,
                    min: Math.min(...temperaturesTimeline) - 10,
                    stepSize: 20,
                }
            }]
        }
    }
    });
}



