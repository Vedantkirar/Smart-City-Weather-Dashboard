const myKey = "2698641d969f5d462c44f17920877eef";
var allData = []; 

function getForecast() {
    var city = document.getElementById("cityInput").value;
    
    if(!city) {
        alert("Please enter a city name");
        return;
    }

    var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + myKey;

    fetch(url)
        .then(function(res) { 
            return res.json(); 
        })
        .then(function(data) {
            if(data.cod !== "200") {
                alert("Error: " + data.message);
                return;
            }

            
            allData = data.list.filter(function(item, index) {
                return index % 8 === 0;
            });

            displayForecast(allData);
        })
        .catch(function(err) {
            alert("Connection error!");
            console.log(err);
        });
}


function displayForecast(list) {
    var container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    list.map(function(day) {
        var div = document.createElement("div");
        div.className = "weather-card";
        
        var date = day.dt_txt.split(' ')[0];
        var mainTemp = Math.round(day.main.temp);
        var feelsLike = Math.round(day.main.feels_like);
        var desc = day.weather[0].description;

        div.innerHTML = `
            <div>
                <p class="card-date">${date}</p>
                <p style="text-transform: capitalize; font-size: 0.85rem; color: #777;">${desc}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-size: 1.2rem; font-weight: bold; color: #2c3e50;">${mainTemp}°C</p>
                <p style="font-size: 0.75rem; color: #7f8c8d;">Feels like: ${feelsLike}°C</p>
            </div>
        `;
        
        container.appendChild(div);
    });
}


document.getElementById("sortBtn").onclick = function() {
    if(allData.length === 0) return;
    var sorted = [...allData].sort(function(a, b) {
        return b.main.temp - a.main.temp;
    });
    displayForecast(sorted);
};


document.getElementById("filterHotBtn").onclick = function() {
    if(allData.length === 0) return;
    var hotDays = allData.filter(function(day) {
        return day.main.temp > 20;
    });
    displayForecast(hotDays);
};


document.getElementById("resetBtn").onclick = function() {
    displayForecast(allData);
};


document.getElementById("searchBtn").onclick = getForecast;