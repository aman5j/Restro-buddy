import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import { getData,postData, serverURL } from "../../services/FetchNodeServices"
import { Grid,Button, TextField,FormControl,InputLabel,Select, MenuItem, FormLabel, RadioGroup, FormControlLabel,Radio, Avatar, FormHelperText } from "@mui/material"
import { Dialog,DialogActions,DialogContent } from "@mui/material"
import Heading from "../../components/heading/Heading"
import { UploadFile } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import restauranticon from '../../assets/logo.png'

const useStyles = makeStyles({
    rootdisplay:{
        width:'auto',
        height:'auto',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    boxdisplay:{
        width:900,
        height:'auto',
        background:'#fff',
        padding:15,
        borderRadius:10,
        marginTop:25
    },
    root:{
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    box:{
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12
    },
})
export default function DisplayAllFoodItem()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [foodItemList,setFoodItemList]=useState([])
    const [open,setOpen]=useState(false)
    const [tempFile,setTempFile]=useState({icon:''})
    const [foodItemId,setFoodItemId]=useState('')
    const [btnStatus,setBtnStatus]=useState(false)
    const navigate = useNavigate()

    /*////////////////////////////////////FoodItem Data ////////////////////////////// */
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

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord=true
        if(restaurantId.trim().length===0)
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
        if(isNaN(price) || !price)
        {
            handleError(true,'price','Pls Input correct Price')
            submitRecord=false
        }
        if(isNaN(offerPrice) || !offerPrice)
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
        var body={
        'restaurantid':restaurantId,
        'categoryid':categoryId,
        'fooditemname':foodItemName,
        'foodtype':foodType,
        'ingredients':ingredients,
        'price':price,
        'offerprice':offerPrice,
        'fooditemid':foodItemId
        }
        var result = await postData('fooditem/fooditem_edit_data',body)
        if(result.status)
        {
            Swal.fire({
                icon: 'success',
                position: "top-end",
                title: 'FoodItem Update',
                text:  result.message,
                showConfirmButton: false,
                timer:3000,
                toast: true
              })
              fetchAllFoodItems()
        }
        else
        {
            Swal.fire({
                icon: 'error',
                position: "top-end",
                title: 'FoodItem Register',
                showConfirmButton: false,
                text: result.message,
                timer:3000,
                toast: true
              })
        }
    }
}

    const handlefoodtype=(event)=>{
        setFoodType(event.target.value)
        handleError(false,'foodType','')
    }

    const handleCancel=()=>{
        setIcon({url:tempFile.icon,bytes:''})
        setBtnStatus(false)
    }

    const editImage=async()=>{
        var formData = new FormData()
        formData.append('fooditemid',foodItemId)
        formData.append('icon',icon.bytes)
        var result = await postData('fooditem/fooditem_edit_icon',formData)
        {
            if(result.status)
            {
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 3000,
                toast:true
                
                })
                fetchAllFoodItems()
            }
            else 
            {
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 3000,
                toast:true
                })
            }
        }
    }

    const editDeleteButton=()=>{
        return(<div>
            <Button onClick={editImage}>Edit</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </div>)
    }


    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        handleError(false,'icon','')
        setBtnStatus(true)
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
    },[])





    /*//////////////////////////////////////End FoodItem Data /////////////////////////// */

    const fetchAllFoodItems=async()=>{
        var result = await postData('fooditem/fetch_all_fooditems',{'restaurantid':admin.restaurantid})
        setFoodItemList(result.data)
    }

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setCategoryId(rowData.categoryid)
        setFoodItemName(rowData.fooditemname)
        setFoodType(rowData.foodtype)
        setIngredients(rowData.ingredients)
        setPrice(rowData.price)
        setOfferPrice(rowData.offerprice)
        setFoodItemId(rowData.fooditemid)
        setIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
        setTempFile({icon:`${serverURL}/images/${rowData.icon}`})

        setOpen(true)

    }

    const showData=()=>{
        return(<div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"FoodItem Interface"} myroute={'/admindashboard/displayallfooditem'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            disabled
                            onFocus={()=>handleError(false,'restaurantId','')}
                            error={resError?.restaurantId?.error}
                            helperText={resError?.restaurantId?.message}
                            onChange={(event)=>setRestaurantId(event.target.value)}
                            size="small"
                            value={restaurantId}
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
                            onFocus={()=>handleError(false,'foodItemName','')}
                            error={resError?.foodItemName?.error}
                            helperText={resError?.foodItemName?.message}
                            onChange={(event)=>setFoodItemName(event.target.value)}
                            size="small"
                            value={foodItemName}
                            label="Fooditem Name"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'ingredients','')}
                            error={resError?.ingredients?.error}
                            helperText={resError?.ingredients?.message}
                            onChange={(event)=>setIngredients(event.target.value)}
                            size="small"
                            value={ingredients}
                            label="Ingredients"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'price','')}
                            error={resError?.price?.error}
                            helperText={resError?.price?.message}
                            onChange={(event)=>setPrice(event.target.value)}
                            size="small"
                            value={price}
                            label="Price"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField  
                            onFocus={()=>handleError(false,'offerPrice','')}
                            error={resError?.offerPrice?.error}
                            helperText={resError?.offerPrice?.message}
                            onChange={(event)=>setOfferPrice(event.target.value)}
                            size="small"
                            value={offerPrice}
                            label="Offer Price"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Food Type</FormLabel>
                            <RadioGroup row>
                                <FormControlLabel checked={foodType === 'veg'} onChange={handlefoodtype} label="Veg" value={"veg"} control={<Radio/>} />
                                <FormControlLabel checked={foodType === 'nonveg'} onChange={handlefoodtype} label="NonVeg" value={"nonveg"} control={<Radio/>} />
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
                            <div>
                                {btnStatus ? editDeleteButton() : <></>}
                            </div>
                        </div>
                        <div>
                            {resError?.icon?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.icon?.message}</div> : <></>}
                        </div>
                    </Grid>
                    
                </Grid>
            </div>
    
        </div>)
    }

    const handleDialogClose=()=>{
        setOpen(false)
    }

    const showDataForEdit=()=>{
        return(<div>
        <Dialog
            maxWidth={'md'}
            open={open} 
            >
            <DialogContent>
                {showData()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Edit</Button>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>

        </div>)
    }

    useEffect(function(){
        fetchAllFoodItems()
    },[])

    const handleDelete=async(rowData)=>{
        Swal.fire({
            title: 'Do you want to delete the record?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var body = {'fooditemid':rowData.fooditemid}
                var result = await postData('fooditem/fooditem_delete',body)
              if(result.status)
              {
                Swal.fire('Deleted!', '', result.message)
                fetchAllFoodItems()
              }
              else 
                Swal.fire('Fail!', '', result.message)
    
            } else if (result.isDenied) {
              Swal.fire('Food not Delete', '', 'info')
            }
          })
    }


    function displayAll() {
        return (
          <MaterialTable
            title={
                <div style={{display:'flex',alignItems:'center'}}>
                    <div>
                        <img src={restauranticon} style={{width:50,height:50}} />
                    </div>
                    <div style={{fontSize:18,fontWeight:'bold',fontFamily:'Kanit',marginLeft:5}}>
                        FoodItem List 
                    </div>
                </div>
            }
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'CategoryName', field: 'categoryname' },
              { title: 'Food Name',
                render: rowData=> <>{rowData.fooditemname}<div>({rowData.foodtype})</div></> },
              { title: 'Ingredients', field: 'ingredients' },
              { title: 'Price',
                render: rowData=> <><div><s>{rowData.price}</s></div><div>{rowData.offerprice}</div></>
              },
              { title: 'Icon',
                render: rowData=> <div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:40,height:40}}/></div>
              },
              
            ]}
            data={foodItemList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit FoodItem',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete FoodItem',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add FoodItem',
                isFreeAction: true,
                onClick: (event, rowData) => navigate('/admindashboard/fooditeminterface')
              },

            ]}
          />
        )
      }
    return(<div className={classes.rootdisplay}>
        <div className={classes.boxdisplay}>
            {displayAll()}
        </div>
            {showDataForEdit()}
    </div>)
}