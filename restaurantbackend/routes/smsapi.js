var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/sendotp',function(req,res){
    console.log("API YES", req.body)
    var options = {
        method: "GET",
        url: 'http://164.114.117.218/GatewayAPI/rest',
        qs: {

            loginid: 'VIKSDIWS',
            password: 'nis123@@',
            msg: req.body.otp,

            send_to: req.body.mobileno,

            senderId: 'DEMOOS',
            routerId: '8',
            snsContentType: 'english'
        },
        headers: {
            "Cache-Control": "no-cache",

        }

    };

    console.log("options:", options)
    request(options, function(error, result){
        if(error){
            console.log(error)
            return (res.json({
                return: false
            }))
        } else {
            console.log(result)
            return (res.json({
                result: true
            }))
        }
    })

})

module.exports = router