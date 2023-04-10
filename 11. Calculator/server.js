const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000,function(){
    console.log('listening on port 3000...');
});

//Get requests

app.get('/', function(req,res){
    res.sendFile(__dirname+"/index.html");
});


app.get('/bmiCalculator', function (req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});

//post requests/updates

app.post('/', function(req,res){
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send("The result of the calculation is " + result);
    // console.log(req.body.num1);
});

app.post('/bmiCalculator', function(req,res){
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    var result = weight/(height*height);
    res.send("Your BMI is " + result);
});