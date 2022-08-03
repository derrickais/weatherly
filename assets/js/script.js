searchBar = document.querySelector('.search-bar');
buttons = document.querySelector('.city-buttons')

//Handles click events on city-buttons
const buttonsClickHandler = function(event) {
    event.preventDefault();

    const latLon = event.target.value;
    const lat = latLon.split(',')[0];
    const lon = latLon.split(',')[1];
    const city = latLon.split(',')[2];

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=f6926a2fd0fdeaa90b08a4d965e1222f`

    fetchData(url, city);
}

//Handles dropdown search on search-bar
const searchBarSubmitHandler = function(event) {
    event.preventDefault();
    
    const select = document.getElementById('city');

    const latLon = select.options[select.selectedIndex].value;
    const lat = latLon.split(',')[0];
    const lon = latLon.split(',')[1];
    const city = latLon.split(',')[2];

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=f6926a2fd0fdeaa90b08a4d965e1222f`

    fetchData(url, city);
}

//fetches API data and tracks last request parameters
const fetchData = function(url, city){
    const storage = {
        url, city 
    }

    localStorage.setItem("weatherData", JSON.stringify(storage));
    

    fetch(url)
        .then(res => {
            return res.json()
        })
        .then (data => {
            console.log(data)
            populatePage(data,city)
        })
        .catch(err => {
            console.log(err)
        })
}

//Populates page using API data
const populatePage = function(data,city) {
    const currentTemp = data.current.temp;
    const currentWind = data.current.wind_speed;
    const currentHumidity = data.current.humidity;
    const currentUV = data.current.uvi;
    const currentDate = moment().format("dddd, MM/DD/YYYY");


    const dayForecast = document.querySelector('.day-forecast');
    dayForecast.innerHTML = `
        <h1> ${city}: ${currentDate} <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"></h1>
        <p>Temperature: ${currentTemp}°F</p>
        <p>Wind: ${currentWind}MPH</p>
        <p>Humidity: ${currentHumidity}%</p>
        <p>UV Index: ${currentUV}</p>
    `

    const weekForecast = document.querySelector('.weekly-forecast')
    weekForecast.innerHTML = `
        <h1>5-Day Forecast</h1>
        <div class="cards">
        </div>
    ` 
    const cards = document.querySelector('.cards');

    data.daily.slice(1,6).forEach((dailyData, index) => {
        console.log(dailyData)
        const date = moment().add('days', index + 1).format('dddd, MM/DD/YYYY');
        cards.innerHTML += `
            <div class="day">
                <h2>${date}</h2>
                <img src="http://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png">
                <p>Temp: ${dailyData.temp.day}°F</p>
                <p>Wind: ${dailyData.wind_speed}MPH </p>
                <p>Humidity: ${dailyData.humidity}%</p>
            </div>
        `
    });
    
} 

//Checks localStorage for API parameters
const checkLocalStorage = function(){
    const data = localStorage.getItem("weatherData")
    if (data){
        const storage = JSON.parse(data)
        fetchData(storage.url, storage.city);
    }
}

checkLocalStorage();
buttons.addEventListener('click', buttonsClickHandler)
searchBar.addEventListener('submit', searchBarSubmitHandler);