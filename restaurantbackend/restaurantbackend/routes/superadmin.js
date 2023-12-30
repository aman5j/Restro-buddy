var express = require('express');
var router = express.Router();
const pool = require('./pool');
var jwt = require('jsonwebtoken');

/* GET home page. */

/*
router.post('/chktoken',function(req,res,next){
    console.log(req.headers.Authorization)
    const token = req.headers.Authorization
    jwt.verify(token,'shhhhhh',req.headers.Authorization, function(err, decoded) {
        console.log(err, decoded);
        res.status(200).json(decoded); 
    });
    //res.status(200).json({status:'Invalid Token'})
});
*/

router.post('/checklogin', function (req, res, next) {
    console.log(req.body)
    pool.query('select * from superadmin where emailid=? and password=?', [req.body.emailid, req.body.password], function (error, result) {
        if (error) {
            console.log("Database Error")
            res.status(200).json({ status: false, data: [], message: 'Server Error...' })
        }
        else {
            if (result.length == 1) {
                // { expiresIn: "60s" }
                var token = jwt.sign({ data: result[0] }, 'shhhhhh')
                console.log(token)
                res.status(200).json({ status: true, data: result[0], message: 'Login Successful', token })
            }
            else {
                res.status(200).json({ status: false, data: [], message: 'Invalid userid/password' })
            }
        }
    })
})

module.exports = router;
