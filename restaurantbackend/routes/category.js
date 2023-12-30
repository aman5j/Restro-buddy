var express = require('express');
const pool = require('./pool');
var router = express.Router();
var upload = require('./multer')

/* GET home page. */
router.post('/category_submit',upload.any(),function(req,res,next){
    try{
        pool.query("insert into category (restaurantid,categoryname,icon) values(?,?,?)",[req.body.restaurantid,req.body.categoryname,req.files[0].filename],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'Category Submitted Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})


router.post('/fetch_all_categories', function(req,res,next){
    try{
        pool.query('select C.*,(select R.restaurantname from restaurants R where R.restaurantid=C.restaurantid) as restaurantname from category C where C.restaurantid=?',[req.body.restaurantid],function(error,result){
            if(error)
            {
                res.status(200).json({status:false,message:'Database Error',data:[]})
            }
            else
            {
                res.status(200).json({status:true,message:'Categories Added Successfully',data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,data:[],message:'Error'})
    }
})

router.post('/category_edit_data', function(req, res, next) {
    try{
      pool.query('update category set restaurantid=?, categoryname=? where categoryid=?',[req.body.restaurantid,req.body.categoryname,req.body.categoryid],function(error,result){
          if(error)
          {
              res.status(200).json({status:false,message:'Database Error'})
          }
          else
          {
              res.status(200).json({status:true,message:'Category Updated Successfully'})
          }
      })
    }
    catch(e)
    {
      console.log('Error',e)
      res.status(200).json({status:false,message:'Error'})
    }
  });

router.post('/category_edit_icon',upload.any(), function(req, res, next) {
    try{
      pool.query('update category set icon=? where categoryid=?',[req.files[0].filename, req.body.categoryid],function(error,result){
          if(error)
          {   console.log("Database Error",error)
              res.status(200).json({status:false,message:'Database Error'})
          }
          else
          {
              res.status(200).json({status:true,message:'Category Icon Updated Successfully'})
          }
      })
    }
    catch(e)
    {
      console.log('Error',e)
      res.status(200).json({status:false,message:'Error'})
    }
});

router.post('/category_delete', function(req, res, next) {
    try{
      pool.query('delete from category where categoryid=?',[req.body.categoryid],function(error,result){
          if(error)
          {   console.log("Database Error",error)
              res.status(200).json({status:false,message:'Database Error'})
          }
          else
          {
              res.status(200).json({status:true,message:'Category Deleted Successfully'})
          }
      })
    }
    catch(e)
    {
      console.log('Error',e)
      res.status(200).json({status:false,message:'Error'})
    }
});


module.exports = router;
