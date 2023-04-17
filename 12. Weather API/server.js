const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const https = require('node:https');

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000,function(){
    console.log('listening on port 3000');
})

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.post('/', function(req,res){
    var city = req.body.cityName;
    console.log(city);
    // res.send(city);
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=c876aedb46c565b6fe94baacc9594532&units=metric";
    console.log(url);
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on('data', function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const name = weatherData.name;
            const temp = weatherData.main.temp;
            const icon_code = weatherData.weather[0].icon;
            const weatherDescription = weatherData.weather[0].description;
            res.write("<p>The weather is currently: " + weatherDescription + "</p>");
            res.write("<h1>The current temperature in " + name + " is: " + temp + " degrees Celcius</h1>");
            const image_url = "https://openweathermap.org/img/wn/" + icon_code + "@2x.png";
            res.write("<img src=" + image_url + ">");
            // path = __dirname+'/index.html';
            // res.write("<a href = "+ path +"> Go Back</a>");
            res.send();
            
        })
    })
})