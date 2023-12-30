var express = require('express');
const pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.post('/waitertable_submit', function(req, res, next) {
  try{
    pool.query("insert into waitertable (restaurantid, waiterid, tableid, currentdate) values (?,?,?,?)",[req.body.restaurantid, req.body.waiterid, req.body.tableid, req.body.currentdate],function(error,result){
        if(error)
        {
            console.log("Database",error)
            res.status(200).json({status:false,message:'Database Error'})
        }
        else 
        {
            res.status(200).json({status:true,message:'Waiter Assigned Table Successfully'})
        }
    })
  }
  catch(e)
  {
    console.log("Error",e)
    res.status(200).json({status:false,message:'Error'})
  }
});

router.post('/fetch_all_waitertables', function(req, res, next) {
  try{
    pool.query("select WT.*,(select W.waitername from waiter W where W.waiterid=WT.waiterid) as waiter_name, (select T.tableno from tablebooking T where T.tableid=WT.tableid) as tableno, (select T.floor from tablebooking T where T.tableid=WT.tableid) as floor from waitertable WT where WT.restaurantid=?",[req.body.restaurantid],function(error,result){
        if(error)
        {
            console.log("Database",error)
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

router.post('/waitertable_edit_data', function(req, res, next) {
    try{
      pool.query("update waitertable set restaurantid=?, waiterid=?, tableid=?, currentdate=? where waitertableid=?",[req.body.restaurantid, req.body.waiterid, req.body.tableid, req.body.currentdate, req.body.waitertableid],function(error,result){
          if(error)
          {
              console.log("Database",error)
              res.status(200).json({status:false,message:'Database Error'})
          }
          else 
          {
              res.status(200).json({status:true,message:'WaiterTable Updated Successfully'})
          }
      })
    }
    catch(e)
    {
      console.log("Error",e)
      res.status(200).json({status:false,message:'Error'})
    }
  });

  router.post('/waitertable_delete', function(req, res, next) {
    try{
      pool.query("delete from waitertable where waitertableid=?",[req.body.waitertableid],function(error,result){
          if(error)
          {
              console.log("Database",error)
              res.status(200).json({status:false,message:'Database Error'})
          }
          else 
          {
              res.status(200).json({status:true,message:'WaiterTable Deleted Successfully'})
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
