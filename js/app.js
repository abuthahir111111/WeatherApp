let searchString = "";
let searchBar = document.querySelector(".search>input");
let searchButton = document.querySelector(".search>button");
let form = document.querySelector(".search");
let geocoderURL = "http://api.openweathermap.org/geo/1.0/direct";
let forecastURL = "https://api.openweathermap.org/data/2.5/weather"
let weatherBody = document.querySelector("article");


async function searchCity(city) {
    let parameters = {
        method: "GET",
        body: {
            q: city,
            appid: "6019d87e9d80f3888ab222f96b6de708",
            limit: 5,
        },
    };
    let searchResponse = await fetch(`${geocoderURL}?q=${parameters.body.q}&appid=${parameters.body.appid}&limit=${parameters.body.limit}`);
    let searchData = await searchResponse.json();
    return searchData;
}


async function setResults(lat, lon, city) {
    let url = `${forecastURL}?lat=${lat}&lon=${lon}&appid=6019d87e9d80f3888ab222f96b6de708&units=metric`;
    let forecastResponse = await fetch(url);
    let forecastData = await forecastResponse.json();
    let image = weatherBody.querySelector("img");
    let cityName = document.querySelector(".city-name");
    let temperature = document.querySelector(".temp");
    let description = document.querySelector(".description");
    image.src = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    cityName.textContent = city;
    temperature.textContent = `${forecastData.main.temp}`;
    description.textContent = forecastData.weather[0].description;
}

async function init() {
    let cityData = await searchCity("Chennai");
    let city = cityData[0];
    await setResults(city.lat, city.lon, city.name);
}



// given latitude and longitude, give weather results
function giveWeatherResults(lat, lon) {
    return async function(evt=null) {
        evt.stopPropagation();
        await setResults(lat, lon, this.textContent);
        this.parentElement.remove();
    }
}

// location function
function search(element=null) {
    return async function(evt) {
        evt.stopPropagation();
        let searchResults = document.querySelector(".search-results");
        if (!searchResults) {
            searchResults = document.createElement("div");
            searchResults.classList.add("search-results");
            form.appendChild(searchResults);
        }
        searchResults.innerHTML = "";
        try {
            let searchData = await searchCity(element.value);
            for (let city of searchData) {
                searchResults.innerHTML += `<button type="button" class="search-data">${city.name}</button>`;
                searchResults.querySelectorAll(".search-data").forEach(button => {
                    button.addEventListener('click', giveWeatherResults(city.lat, city.lon));
                });
            }
        }
        catch(error) {console.log(error.message);}
    }
}
searchBar.addEventListener('input', search(searchBar));
searchBar.addEventListener('click', search(searchBar));
searchButton.addEventListener('click', search(searchBar));
document.addEventListener('click', () => {
    let searchResults = document.querySelector(".search-results");
    if (!searchResults) return;
    searchResults.remove();
});


// starter code
init();
