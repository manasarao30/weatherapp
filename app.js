//Geo coords [12.8667, 74.8833]
//api key-a7f31bbbe39deeabac32d6df228239d0

//select the elements
const iconElement=document.querySelector(".weather-icon");
const tempElement=document.querySelector(".temperature-value p");
const descrElement=document.querySelector(".temperature-description p");
const locationElement=document.querySelector(".location p");
const notificationElement=document.querySelector(".notification");

//APP DATA
//create a weather object
const weather={};

//define the temperature as celsius unit
weather.temperature={
    unit:"celsius"
}

//define some app constants and variables
const KELVIN=273;
//API KEY
const key="a7f31bbbe39deeabac32d6df228239d0";

//CHECK IF BROWSER SUPPORTS GEOLOCATION-IF TRUE GET CURRENT POSITION
if('geolocation' in navigator)
{
    navigator.geolocation.getCurrentPosition(setPosition,showError);
}
else{
    //if it doesnt support geolocation display an error message
    notificationElement.style.display="block";
    notificationElement.innerHTML="<p>Browser doesnt support geolocation</p>";
}

//SET USER'S POSITION
function setPosition(position)
{
    let latitude=position.coords.latitude;
    let longitude=position.coords.longitude;

    getWeather(latitude,longitude);
}

//SHOW ERROR IF THERES AN ISSUE WITH GEOLOCATION SERVICE
function showError(error)
{
    notificationElement.style.display="block";
    notificationElement.innerHTML=`<p> ${error.message}</p>`;
}

//GET WEATHER FROM API PROVIDER
function getWeather(latitude,longitude)
{
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    //console.log(api);

    //fetch the api and when you get the response you need to pass it
    fetch(api)
    .then(function(response){
        let data=response.json();
        return data;
    })
    //data is an object.Inside the function update the temperature value-convert it to celsius
    .then(function(data){
       weather.temperature.value=Math.floor(data.main.temp-KELVIN);
       weather.description=data.weather[0].description;
       weather.iconId=data.weather[0].icon;
       weather.city=data.name;
       weather.country=data.sys.country;
    })
    .then(function(){
        displayWeather();
    });
}
    //DISPLAY THE WEATHER TO THE USER
function displayWeather(){
    iconElement.innerHTML=`<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML=`${weather.temperature.value}°<span>C</span>`;
    descrElement.innerHTML=weather.description;
    locationElement.innerHTML=`${weather.city}, ${weather.country}`;
}

//CELSIUS TO FAHRENHEIT CONVERSION
function celsiusToFahrenheit(temperature){
    return (temperature*9/5)+32;
}

//WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click",function(){
    if(weather.temperature.value===undefined) return;

    if(weather.temperature.unit=="celsius"){
        let fahrenheit=celsiusToFahrenheit(weather.temperature.value);
        fahrenheit=Math.floor(fahrenheit);
        tempElement.innerHTML=`${fahrenheit}°<span>F</span>`;
        weather.temperature.unit="fahrenheit"
    }else{
        tempElement.innerHTML=`${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit="celsius";
    }
});
