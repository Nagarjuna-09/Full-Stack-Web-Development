const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('node:https');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));

app.listen(process.env.PORT || 3000,function () {
    console.log('listening on port 3000');
})

app.get('/', function (req,res){
    res.sendFile(__dirname+'/signup.html');
});

app.post('/', function (req,res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const data = {
        members: [{
            email_address: email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstname,
                LNAME:lastname,
            }
        }],
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/477d2e38bf';
    const options = {
        auth:'user:93e6b2447976fee293af611bf83b1ed0-us14',
        method: 'POST',
    };
    const request = https.request(url,options,function(response){
        console.log(response.statusCode);
        response.on('data', function(data){
            if (response.statusCode === 200 && JSON.parse(data).errors.length === 0) {
                // res.send('Successfully subscribed!');
                res.sendFile(__dirname + '/success.html');
            }
            else {
                // res.send('Error in signing up. Please resubscribe');
                res.sendFile(__dirname + '/failure.html');
            }
            console.log(JSON.parse(data));
        });
        
    })

    request.write(jsonData);
    request.end();
});

app.post('/failure', function (req, res) {
    res.redirect('/');
});

// //mail chimp key
// 93e6b2447976fee293af611bf83b1ed0 - us14

// //audience id or list id
// 477d2e38bf