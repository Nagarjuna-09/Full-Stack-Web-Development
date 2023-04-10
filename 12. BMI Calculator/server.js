const express = require('express');
var bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000,function(){
    console.log('listening on port 3000...');
})

app.get('/', function(req,res){
    res.sendFile(__dirname+'/bmiCalculator.html');
})

app.post('/', function(req,res){
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    result = (weight/(height*height));
    res.send("You entered " + result + " kg/m2");
});