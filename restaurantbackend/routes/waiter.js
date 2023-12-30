var express = require('express');
var router = express.Router();
const pool = require('./pool');
const upload = require('./multer');

/* GET home page. */
router.post('/waiter_submit',upload.any(), function(req, res, next) {
  try{
    pool.query("insert into waiter (restaurantid, waitername, gender, dob, mobileno, emailid, address, picture) values (?,?,?,?,?,?,?,?) ",[req.body.restaurantid, req.body.waitername, req.body.gender, req.body.dob, req.body.mobileno, req.body.emailid, req.body.address, req.files[0].filename], function(error,result){
        if(error)
        {
            console.log("Database Error",error)
            res.status(200).json({status:false,message:"Database Error"})
        }
        else 
        {
            res.status(200).json({status:true,message:"Waiter Register Successfully"})
        }
    })
  }
  catch(e)
  {
    console.log("Error",e)
    res.status(200).json({status:false,message:'Error'})
  }
});

router.post('/fetch_all_waiters', function(req, res, next) {
  try{
    pool.query("select W.*, (select R.restaurantname from restaurants R where R.restaurantid=W.restaurantid) as restaurantname from waiter W where W.restaurantid=?",[req.body.restaurantid], function(error,result){
        if(error)
        {
            console.log("Database Error",error)
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
});

router.post('/waiter_edit_data', function(req, res, next) {
    try{
      pool.query("update waiter set restaurantid=?, waitername=?, gender=?, dob=?, mobileno=?, emailid=?, address=? where waiterid=?",[req.body.restaurantid, req.body.waitername, req.body.gender, req.body.dob, req.body.mobileno, req.body.emailid, req.body.address, req.body.waiterid], function(error,result){
          if(error)
          {
              console.log("Database Error",error)
              console.log("Ename:",error.name)
              res.status(200).json({status:false,message:"Database Error"})
          }
          else 
          {
              res.status(200).json({status:true,message:"Waiter Updated Successfully"})
          }
      })
    }
    catch(e)
    {
      console.log("Error",e)
      res.status(200).json({status:false,message:'Error'})
    }
});

router.post('/waiter_edit_picture',upload.any(), function(req, res, next) {
    try{
      pool.query("update waiter set picture=? where waiterid=?",[req.files[0].filename, req.body.waiterid], function(error,result){
          if(error)
          {
              console.log("Database Error",error)
              res.status(200).json({status:false,message:"Database Error"})
          }
          else 
          {
              res.status(200).json({status:true,message:"Waiter Picture Updated Successfully"})
          }
      })
    }
    catch(e)
    {
      console.log("Error",e)
      res.status(200).json({status:false,message:'Error'})
    }
  });
  
router.post('/waiter_delete', function(req, res, next) {
    try{
      pool.query("delete from waiter where waiterid=?",[req.body.waiterid], function(error,result){
          if(error)
          {
              console.log("Database Error",error)
              res.status(200).json({status:false,message:"Database Error"})
          }
          else 
          {
              res.status(200).json({status:true,message:"Waiter Deleted Successfully"})
          }
      })
    }
    catch(e)
    {
      console.log("Error",e)
      res.status(200).json({status:false,message:'Error'})
    }
  });
  

module.exports = router;
