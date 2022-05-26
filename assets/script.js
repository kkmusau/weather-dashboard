//Creates an event listener on the button that execute the Handle Click function
document.querySelector('button').addEventListener('click', handleClick);

//Set the local storage not to store undefined city and add the text to the history
if (localStorage.cities != undefined) {
    eval(localStorage.cities).forEach(city => {
        document.querySelector('.history').innerHTML +=
            `<button onclick="handleHistory('${city}')">${city}</button><br>`
    });
};

//Function to get the the city temp when clicked in history
function handleHistory(city) {
    document.querySelector('input').value = city;
    handleClick();
}

// Function to get and display the weather data through the Open Weather Map API
function handleClick() {
    let city = document.querySelector('input').value;

    if (city) {
        //Set url1 to fetch data using the API with city paramaters
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
        fetch(url).then(data => data.json()).then(data => {
            //If searched city cannot be found
            if (!data.length) return;
            let { lat, lon } = data[0]
            // Set url2 to fectch from the API using weather search with imperical units added to search
            let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
            fetch(url2).then(data => data.json()).then(data => {

                //Saving the city to local storage
                let store = eval(localStorage.cities) || [];
                store.push(city);
                localStorage.cities = JSON.stringify(store);
                //Getting uv results in the UVindex
                let uv = data.current.uvi;

                //  HTML search results to display in current weather
                document.querySelector('.current').innerHTML =
                    `<h1>${city} ${new Date(data.current.dt * 1000).toLocaleDateString()}</h1> 
                    <img src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png">
                    <p>Temp:  ${data.current.temp} </p>
                    <p>Wind:  ${data.current.wind_speed} </p>
                    <p>Humidity:  ${data.current.humidity} </p>
                    <p>UV Index:  <span class="${uv < 4 ? 'green' : uv < 8 ? 'yellow' : 'red'}"> ${uv} </span></p>
                
                    `
                // HTML search results to display in daily weather through a loop
                for (i = 0; i < 5; i++) {
                    document.querySelector('.fiveDays').innerHTML +=
                        `<div class="card">
                                    <h4>${new Date(data.daily[i].dt * 1000).toLocaleDateString()}</h4>
                                    <img src="http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"> 
                                    <p>Temp:  ${data.daily[i].temp.day} </p>
                                    <p>Wind:  ${data.daily[i].wind_speed} </p>
                                    <p>Humidity: ${data.daily[i].humidity} </p>
                                </div>`
                }

            });

        });
    }
}
