const myKey = "2698641d969f5d462c44f17920877eef";

function findWeather() {
    var city = document.getElementById("cityInput").value;
    var resultDiv = document.getElementById("weatherResult");

    
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + myKey;


    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            
            var name = data.name;
            var temp = data.main.temp;
            var sky = data.weather[0].description;

            resultDiv.innerHTML = "<h2>" + name + "</h2>" + 
                                  "<p>Temp: " + temp + "°C</p>" + 
                                  "<p>Sky: " + sky + "</p>";
        })
        .catch(function(error) {
            resultDiv.innerHTML = "City not found!";
        });
}

document.getElementById("searchBtn").onclick = findWeather;