let weather = {
    apiKey: "YOUR API KEY", // OpenWeatherMap API key
    pexelsApiKey: "YOUR API KEY", // Pexels API key
    fetchWeather: function (city) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => {
          this.displayWeather(data);
          this.fetchBackgroundImage(data.name);
        })
        .catch((error) => {
          console.error("Error fetching weather:", error);
          // Handle errors as needed
        });
    },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
  
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
    },
    fetchBackgroundImage: function (cityName) {
      const pexelsBaseUrl = "https://api.pexels.com/v1/search";
      const query = encodeURIComponent(cityName);
      const pexelsUrl = `${pexelsBaseUrl}?query=${query}&per_page=1&page=1`;
  
      fetch(pexelsUrl, {
        headers: {
          Authorization: this.pexelsApiKey,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch image from Pexels");
          }
          return response.json();
        })
        .then((data) => {
          const imageUrl = data.photos[0].src.large; // Adjust based on Pexels API response structure
          document.body.style.backgroundImage = `url('${imageUrl}')`;
        })
        .catch((error) => {
          console.error("Error fetching image from Pexels:", error);
          // Fallback or default background image if there's an error
          document.body.style.backgroundImage = `url('fallback-image-url.jpg')`;
        });
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });
  
  // Initial fetch for default city (Denver)
  weather.fetchWeather("Denver");
  