const cityInputEl = document.getElementById("city-input");
const searchedEl = document.getElementById("searched-cities");
const todayEl = document.getElementById("today");
const cityInputText = document.getElementById("city");

let buttonCheck = true;

function getCityWeather(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=cfc92c00896dc6d5d2449b9d8d8bca12`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const cityName = data[0].name;
      const cityLat = data[0].lat.toFixed(2);
      const cityLon = data[0].lon.toFixed(2);

      console.log(`Name: ${cityName}`);
      console.log(`Lat: ${cityLat}`);
      console.log(`Lon: ${cityLon}`);

      get5DayForecast(cityLat, cityLon);

      cityInputText.value = "";
    });
}

function get5DayForecast(cityLat, cityLon) {
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=41&appid=cfc92c00896dc6d5d2449b9d8d8bca12&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      const dailyForecast = [];
      let datesProcessed = [];

      const cityName = data.city.name;

      for (let i = 0; i < data.list.length; i++) {
        const item = data.list[i];
        const date = dayjs.unix(item.dt).format("M/DD/YYYY");
        let time = dayjs.unix(item.dt).format("HH:MM");

        // Check if the date already exists in the dailyForecast object
        if (!datesProcessed.includes(date)) {
          datesProcessed.push(date);

          dailyForecast.push({
            name: data.city.name,
            date: date,
            icon: item.weather[0].icon,
            temp: item.main.temp,
            wind: item.wind.speed,
            humidity: item.main.humidity,
          });
        }
      }

      todayEl.innerHTML = "";

      createTodaysWeather(
        cityName,
        dailyForecast[0].date,
        dailyForecast[0].icon,
        dailyForecast[0].temp,
        dailyForecast[0].wind,
        dailyForecast[0].humidity
      );

      createFiveDays(dailyForecast);

      if (buttonCheck) {
        createSearchedButton(cityName);
      }

      buttonCheck = true;
    });
}

function createSearchedButton(cityName) {
  const searchedCity = document.createElement("button");
  searchedCity.setAttribute("class", "btn btn-secondary w-100 mt-2 mb-2");
  searchedCity.setAttribute("id", `${cityName}`);
  searchedCity.textContent = cityName;
  searchedEl.appendChild(searchedCity);

  searchedCity.addEventListener("click", function (event) {
    event.preventDefault();

    getCityWeather(cityName);

    buttonCheck = false;
  });
}

function createTodaysWeather(cityName, date, icon, temp, wind, humidity) {
  let todayCityDiv = document.createElement("div");

  todayCityDiv.setAttribute("class", "row mb-2");
  todayCityDiv.setAttribute("id", "city-and-date");

  let p = document.createElement("p");
  p.setAttribute("class", "h2");
  p.textContent = `${cityName}, ${date}`;

  let img = document.createElement("img");
  img.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);

  let p1 = document.createElement("p");
  p1.textContent = `Temp: ${temp}`;
  p1.setAttribute("class", "h5");

  let p2 = document.createElement("p");
  p2.textContent = `Wind: ${wind}`;
  p2.setAttribute("class", "h5");

  let p3 = document.createElement("p");
  p3.textContent = `Humidity: ${humidity}`;
  p3.setAttribute("class", "h5");

  todayCityDiv.appendChild(p);
  p.appendChild(img);
  todayCityDiv.appendChild(p1);
  todayCityDiv.appendChild(p2);
  todayCityDiv.appendChild(p3);

  todayEl.appendChild(todayCityDiv);
}

function createFiveDays(dailyForecast) {
  let fiveDaysRow = document.createElement("div");
  fiveDaysRow.setAttribute("class", "row");

  let p = document.createElement("p");
  p.setAttribute("class", "h3");
  p.textContent = "5-Day Forecast";
  fiveDaysRow.appendChild(p);

  let fiveDaysRow2 = document.createElement("div");
  fiveDaysRow2.setAttribute("class", "row");

  todayEl.appendChild(fiveDaysRow);
  todayEl.appendChild(fiveDaysRow2);

  for (let i = 1; i < 6; i++) {
    let weather = dailyForecast[i];

    let divv = document.createElement("div");
    divv.setAttribute("class", "col bg-dark text-light mx-2 py-2");

    let p1 = document.createElement("p");
    p1.setAttribute("class", "h4");
    p1.textContent = weather.date;

    let img = document.createElement("img");
    img.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
    );

    let p2 = document.createElement("p");
    p2.textContent = `Temp: ${weather.temp}`;
    p2.setAttribute("class", "h5");

    let p3 = document.createElement("p");
    p3.textContent = `Wind: ${weather.wind}`;
    p3.setAttribute("class", "h5");

    let p4 = document.createElement("p");
    p4.textContent = `Humidity: ${weather.humidity}`;
    p4.setAttribute("class", "h5");

    divv.appendChild(p1);
    divv.appendChild(img);
    divv.appendChild(p2);
    divv.appendChild(p3);
    divv.appendChild(p4);

    fiveDaysRow2.appendChild(divv);
  }
}

cityInputEl.addEventListener("submit", function (event) {
  event.preventDefault();

  let city = document.getElementById("city").value;

  getCityWeather(city);
});
