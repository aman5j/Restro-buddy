var express = require('express');
const pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.get('/fetch_all_states', function(req, res, next) {
   try{
    pool.query("select * from states", function(error,result){
    if(error)
    {   console.log(error)
        res.status(200).json({status:false, message:'Database Error...',data:[]})
    }
    else
    {   console.log(result)
        res.status(200).json({status:true, message:'Success...',data:result})
    }
   })
}
catch(e)
{
    res.status(200).json({status:false, message:'ServerError', data:[]})
}

});

router.post('/fetch_all_cities', function(req, res, next) {
   try{
    console.log("BODY",req.body)
    pool.query("select * from city where stateid=?",[req.body.stateid], function(error,result){
    if(error)
    {   console.log(error)
        res.status(200).json({status:false, message:'Database Error...',data:[]})
    }
    else
    {   console.log(result)
        res.status(200).json({status:true, message:'Success...',data:result})
    }
   })
}
catch(e)
{
    res.status(200).json({status:false, message:'ServerError', data:[]})
}

});

module.exports = router;

