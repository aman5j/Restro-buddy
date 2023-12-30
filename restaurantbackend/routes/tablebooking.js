var express = require('express');
const pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.post('/tablebooking_submit', function(req, res, next) {
    try{
        pool.query('insert into tablebooking (tableno, restaurantid, noofchair, floor) values(?,?,?,?)',[req.body.tableno, req.body.restaurantid, req.body.noofchair, req.body.floor],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'TableBooking Data Added Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
});

router.post("/fetch_all_tablebooking",function(req,res,next){
    try{
        pool.query("select T.*, (select R.restaurantname from restaurants R where R.restaurantid=T.restaurantid) as restaurantname from tablebooking T where T.restaurantid=?",[req.body.restaurantid],function(error,result){
            if(error)
            {
                console.log("Database Error")
                res.status(200).json({status:false,data:[]})
            }
            else 
            {
                res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,data:[]})
    }
})

router.post('/tablebooking_edit_data', function(req, res, next) {
    try{
        pool.query('update tablebooking set tableno=?, restaurantid=?, noofchair=?, floor=? where tableid=?',[req.body.tableno, req.body.restaurantid, req.body.noofchair, req.body.floor, req.body.tableid],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'TableBooking Data Updated Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
});

router.post("/fetch_all_floors",function(req,res,next){
    try{
        pool.query("select floor from tablebooking where restaurantid=? group by floor",[req.body.restaurantid],function(error,result){
            if(error)
            {
                console.log("Database Error")
                res.status(200).json({status:false,data:[]})
            }
            else 
            {
                res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,data:[]})
    }
})

router.post("/fetch_all_table_by_floor",function(req,res,next){
    try{
        pool.query("select * from tablebooking where restaurantid=? and floor=?",[req.body.restaurantid, req.body.floor],function(error,result){
            if(error)
            {
                console.log("Database Error")
                res.status(200).json({status:false,data:[]})
            }
            else 
            {
                res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,data:[]})
    }
})



router.post('/tablebooking_delete',function(req,res,next){
    try{
        pool.query("delete from tablebooking where tableid=?",[req.body.tableid],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'Delete table Booking Data Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post("/fetch_all_tables",function(req,res,next){
    try{
        pool.query("select T.*, (select R.restaurantname from restaurants R where R.restaurantid=T.restaurantid) as restaurantname from tablebooking T where restaurantid=?",[req.body.restaurantid],function(error,result){
            if(error)
            {
                console.log("Database Error")
                res.status(200).json({status:false,data:[]})
            }
            else 
            {
                res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,data:[]})
    }
})


module.exports = router;
