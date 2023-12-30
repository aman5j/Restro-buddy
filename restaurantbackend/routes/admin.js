var express = require('express');
const pool = require('./pool');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page */

router.post('/checklogin', function (req, res, next) {
    try {
        pool.query('select * from restaurants where (emailid=? or mobileno=?) and password=?', [req.body.emailid, req.body.mobileno, req.body.password], function (error, result) {
            if (error) {
                res.status(200).json({ status: false, data: [], message: 'Server Error...' })
            }
            else {
                if (result.length == 1) {
                    // console.log("result", result)
                    var token = jwt.sign({ data: result[0] }, 'shhhhhh')
                    res.status(200).json({ status: true, data: result[0], message: 'Login Successfull',token })
                }
                else {
                    res.status(200).json({ status: false, data: [], message: 'Invalid UserId/Password' })
                }
            }
        })
    }
    catch (e) {
        res.status(200).json({ status: false, data: [], message: 'Server Error...' })
    }
})

module.exports = router;