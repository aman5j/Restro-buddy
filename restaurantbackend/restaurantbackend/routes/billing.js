var express = require('express');
const pool = require('./pool');
var router = express.Router();
var upload = require('./multer')

/* GET home page. */
router.post('/bill_submit',function(req,res,next){
    try{
        pool.query("insert into billing (billtime, billdate, tableno, server, fssai, cnote, gst, billingdetails, totalamount, customername, mobileno) values (?,?,?,?,?,?,?,?,?,?,?)",[req.body.billtime, req.body.billdate, req.body.tableno, req.body.server, req.body.fssai, req.body.cnote, req.body.gst, req.body.billingdetails, req.body.totalamount, req.body.customername, req.body.mobileno],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'Bill Submitted Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post('/fetch_total',function(req,res,next){
    try{
        pool.query("select sum(totalamount) as totalbill from billing where billdate between ? and ?",[req.body.from,req.body.to],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {   
                console.log("Today Total",result)
                res.status(200).json({status:true,data:result[0],message:'Success'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post('/display_all_bills_by_billdate',function(req,res,next){
    try{
        console.log(req.body.from+" "+req.body.to)
        pool.query("select * from billing where billdate between ? and ? ",[req.body.from,req.body.to],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {   console.log("Filter Date",result)
                res.status(200).json({status:true,data:result,message:'Success'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post('/fetch_totalsale_month',function(req,res,next){
    try{
        pool.query('select month(billdate) as month, sum(totalamount) as totalbill from billing group by month(billdate) order by billdate',function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {   
                console.log("Today Total",result)
                res.status(200).json({status:true,data:result,message:'Success'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post('/fetch_todays_total',function(req,res,next){
    try{
        pool.query("select sum(totalamount) as totalbill from billing where billdate=?",[req.body.todaysdate],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {   
                console.log("Today Total",result)
                res.status(200).json({status:true,data:result[0],message:'Success'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})


module.exports = router;