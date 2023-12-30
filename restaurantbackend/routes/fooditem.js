var express = require('express');
const pool = require('./pool');
const upload = require('./multer');
var router = express.Router();

/* GET home page. */
router.post('/fooditem_submit',upload.any(), function(req, res, next) {
  try{
    pool.query("insert into fooditem (restaurantid, categoryid, fooditemname, ingredients, foodtype, price, offerprice, icon) values(?,?,?,?,?,?,?,?)",[req.body.restaurantid, req.body.categoryid, req.body.fooditemname, req.body.ingredients, req.body.foodtype, req.body.price, req.body.offerprice, req.files[0].filename],function(error,result){
        if(error)
        {
            console.log("Database Error",error)
            res.status(200).json({status:false,message:"Database Error"})
        }
        else 
        {
            res.status(200).json({status:true,message:"FoodItem Added Successfully"})
        }
    })
  }
  catch(e)
  {
    console.log("Error",e)
    res.status(200).json({status:false,message:'Error'})
  }
});

router.post('/fetch_all_fooditems',function(req,res,next){
    try{
        pool.query('select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname, (select R.restaurantname from restaurants R where R.restaurantid=F.restaurantid) as restaurantname from fooditem F where F.restaurantid=?',[req.body.restaurantid],function(error,result){
            if(error)
            {
                console.log('Database Error',error)
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

router.post('/fooditem_edit_data',function(req,res,next){
    try{
        console.log("BODY:",req.body)
        pool.query("update fooditem set restaurantid=?, categoryid=?, fooditemname=?, ingredients=?, foodtype=?, price=?, offerprice=? where fooditemid=?",[req.body.restaurantid, req.body.categoryid, req.body.fooditemname, req.body.ingredients, req.body.foodtype, req.body.price, req.body.offerprice, req.body.fooditemid],function(error,result){
            if(error)
            {
                console.log("Database Error",error)
                res.status(200).json({status:false,message:"Database Error"})
            }
            else 
            {
                res.status(200).json({status:true,message:"FoodItem Updated Successfully"})
            }

        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.status(200).json({status:false,message:"Server Error"})
    }
})

router.post('/fooditem_edit_icon',upload.any(),function(req,res,next){
    try{
        console.log("BODY",req.body)
        console.log("File",req.files)
        pool.query("update fooditem set icon=? where fooditemid=?",[req.files[0].filename,req.body.fooditemid],function(error,result){
            if(error)
            {
                console.log("Database Error")
                res.status(200).json({status:false,message:"Error"})
            }
            else 
            {
                res.status(200).json({status:true,message:"FoodItem Icon Updated Successfully"})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:"Error"})
    }
})

router.post('/fooditem_delete',function(req,res,next){
    try{
        pool.query("delete from fooditem where fooditemid=?",[req.body.fooditemid],function(error,result){
            if(error)
            {
                console.log("DataBase Error",error)
                res.status(200).json({status:false,message:'Database Error'})
            }
            else 
            {
                res.status(200).json({status:true,message:'FoodItem Deleted Successfully'})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.status(200).json({status:false,message:'Error'})
    }
})

router.post('/fetch_all_fooditems_categorywise',function(req,res,next){
    try{
        console.log(req.body)
        pool.query('select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname, (select R.restaurantname from restaurants R where R.restaurantid=F.restaurantid) as restaurantname from fooditem F where F.restaurantid=? and F.categoryid=?',[req.body.restaurantid,req.body.categoryid],function(error,result){
            if(error)
            {
                console.log('Database Error',error)
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
