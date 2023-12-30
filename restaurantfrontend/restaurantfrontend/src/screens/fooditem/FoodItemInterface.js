import { Grid,Button, TextField,FormControl,InputLabel,Select, MenuItem, FormLabel, RadioGroup, FormControlLabel,Radio, Avatar, FormHelperText } from "@mui/material"
import Heading from "../../components/heading/Heading"
import { UploadFile } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getData, postData } from "../../services/FetchNodeServices"

const useStyles = makeStyles({
    root:{
        width:'auto',
        height:'100vh',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    box:{
        width: 900,
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12
    },
})
export default function FoodItemInterface()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    ///////////?useStates//////////////////////////////
    const [restaurantId,setRestaurantId]=useState('')
    const [foodItemName,setFoodItemName]=useState('')
    const [foodType,setFoodType]=useState('')
    const [ingredients,setIngredients]=useState('')
    const [price,setPrice]=useState('')
    const [offerPrice,setOfferPrice]=useState('')
    const [icon,setIcon]=useState({url:'',bytes:''})
    const [categoryId,setCategoryId]=useState('')
    const [categorylist,setCategoryList]=useState([])
    const [resError,setResError]=useState('')

    const handleReset=()=>{
        setFoodItemName('')
        setFoodType('')
        setIngredients('')
        setPrice('')
        setOfferPrice('')
        setIcon({url:'',bytes:''})
        setCategoryId('')
    }

    
    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord=true
        if(restaurantId.length===0)
        {
            handleError(true,'restaurantId','Pls Input Restaurant Id')
            submitRecord=false
        }
        if(!categoryId)
        {
            handleError(true,'categoryId','Pls Select Food Category')
            submitRecord=false
        }
        if(foodItemName.trim().length===0)
        {
            handleError(true,'foodItemName','Pls Input FoodItem Name')
            submitRecord=false
        }
        if(!foodType)
        {
            handleError(true,'foodType','Pls Choose Food Type')
            submitRecord=false
        }
        if(ingredients.trim().length===0)
        {
            handleError(true,'ingredients','Pls Input Ingredients')
            submitRecord=false
        }
        if(isNaN(price) || price.trim().length===0)
        {
            handleError(true,'price','Pls Input correct Price')
            submitRecord=false
        }
        if(isNaN(offerPrice) || offerPrice.trim().length===0)
        {
            handleError(true,'offerPrice','Pls Input Correct OfferPrice')
            submitRecord=false
        }
        if(!icon.url)
        {
            handleError(true,'icon','Pls Upload Icon')
            submitRecord=false
        }
        
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation())
        {
        var formData=new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('categoryid',categoryId)
        formData.append('fooditemname',foodItemName)
        formData.append('foodtype',foodType)
        formData.append('ingredients',ingredients)
        formData.append('price',price)
        formData.append('offerprice',offerPrice)
        formData.append('icon',icon.bytes)
        var result = await postData('fooditem/fooditem_submit',formData)
        if(result.status)
        {
            Swal.fire({
                icon: 'success',
                title: 'FoodItem Register',
                text:  result.message,
              })
        }
        else
        {
            Swal.fire({
                icon: 'error',
                title: 'FoodItem Register',
                text: result.message,
              })
        }
    }
}

    const handlefoodtype=(event)=>{
        setFoodType(event.target.value)
        handleError(false,'foodType','')
    }

    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        handleError(false,'icon','')
    }

    const handleCategoryChange=(event)=>{
        setCategoryId(event.target.value)
    }

    const fetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_categories',{'restaurantid':admin.restaurantid})
        setCategoryList(result.data)
    }

    const fillCategory=()=>{
        return categorylist.map((item)=>{
            return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
        })
    }

    useEffect(function(){
        fetchAllCategory()
        setRestaurantId(admin.restaurantid)
    },[])

    return(<div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Heading title={"FoodItem Interface"} myroute={"/admindashboard/displayallfooditem"}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={restaurantId}
                        disabled
                        size="small"
                        label="Restaurant Id"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <Select 
                            onFocus={()=>handleError(false,'categoryId','')}
                            error={resError?.categoryId?.error}
                            value={categoryId} 
                            label="Category" 
                            onChange={handleCategoryChange}
                        >
                            <MenuItem>-Select Category</MenuItem>
                            {fillCategory()}
                        </Select>
                        <FormHelperText style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.categoryId?.message}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        value={foodItemName}
                        onFocus={()=>handleError(false,'foodItemName','')}
                        error={resError?.foodItemName?.error}
                        helperText={resError?.foodItemName?.message}
                        onChange={(event)=>setFoodItemName(event.target.value)}
                        size="small"
                        label="Fooditem Name"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={ingredients}
                        onFocus={()=>handleError(false,'ingredients','')}
                        error={resError?.ingredients?.error}
                        helperText={resError?.ingredients?.message}
                        onChange={(event)=>setIngredients(event.target.value)}
                        size="small"
                        label="Ingredients"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={price}
                        onFocus={()=>handleError(false,'price','')}
                        error={resError?.price?.error}
                        helperText={resError?.price?.message}
                        onChange={(event)=>setPrice(event.target.value)}
                        size="small"
                        label="Price"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField  
                        value={offerPrice}
                        onFocus={()=>handleError(false,'offerPrice','')}
                        error={resError?.offerPrice?.error}
                        helperText={resError?.offerPrice?.message}
                        onChange={(event)=>setOfferPrice(event.target.value)}
                        size="small"
                        label="Offer Price"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl>
                        <FormLabel>Food Type</FormLabel>
                        <RadioGroup row>
                            <FormControlLabel onChange={handlefoodtype} label="Veg" value={"veg"} control={<Radio/>} />
                            <FormControlLabel onChange={handlefoodtype} label="NonVeg" value={"nonveg"} control={<Radio/>} />
                        </RadioGroup>
                    </FormControl>
                    <div>
                        {resError?.foodType?.error?<div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.foodType?.message}</div> : <></>}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Button component="label" variant="contained" fullWidth endIcon={<UploadFile/>}>
                        <input
                           onFocus={()=>handleError(false,'icon','')}
                           onChange={handleIcon}
                           hidden
                           type="file"
                           accept="image/*"
                           multiple
                        />
                        Upload Icon
                    </Button>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',paddingTop:5}}>
                        <Avatar
                            variant="rounded"
                            src={icon.url}
                        />
                    </div>
                    <div>
                        {resError?.icon?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.icon?.message}</div> : <></>}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleSubmit} variant="contained" fullWidth>Submit</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleReset}  variant="contained" fullWidth>Reset</Button>
                </Grid>
            </Grid>
        </div>

    </div>)
}