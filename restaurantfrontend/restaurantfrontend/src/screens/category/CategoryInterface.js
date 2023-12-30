import { Grid, TextField, Avatar, Button } from "@mui/material"
import { UploadFile } from "@mui/icons-material";
import Heading from "../../components/heading/Heading"
import { makeStyles } from "@mui/styles"
import { useState, useEffect } from "react";
import { postData } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
const useStyles = makeStyles({
    root: {
        width: 'auto',
        height: '100vh',
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: '60%',
        height: 'auto',
        background:'#fff',
        padding: 12,
        borderRadius: 10
    }
});
export default function CategoryInterface() {
    const classes = useStyles()
    const admin = JSON.parse(localStorage.getItem('ADMIN'))
    
    //////? useStates ////////////////////////////////////
    const [restaurantId,setRestaurantId]=useState('')
    const [categoryName,setCategoryName]=useState('')
    const [icon,setIcon]=useState({url:'',bytes:''})
    const [resError,setResError]=useState({})

    const handleReset=()=>{
        setCategoryName('')
    }
    
    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        handleError(false,'icon','')
    }

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError, [input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord = true 
        if(restaurantId.length===0)
        {
            handleError(true,'restaurantId','Pls Input Restaurant Id')
            submitRecord=false
        }
        if(!categoryName)
        {
            handleError(true,'categoryName','Pls Input Restaurant Id')
            submitRecord=false
        }
        if(!icon.url)
        {
            handleError(true,'icon','Pls Input Restaurant Id')
            submitRecord=false
        }
        
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation())
        {
        var formData=new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('categoryname',categoryName)
        formData.append('icon',icon.bytes)
        var result = await postData('category/category_submit',formData)
        if(result.status)
        {
            Swal.fire({
                icon: 'success',
                title: 'Category Register',
                text: result.message,
                
              })
        }
        else 
        {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.message,
                
              })
        }
    }
}

    return (
    <div className={classes.root}>
        <div className={classes.box}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Heading title={"Category Interface"} myroute={'/admindashboard/displayallcategory'} />
            </Grid>
            
            <Grid item xs={12}>
                <TextField
                    value={restaurantId}
                    disabled
                    label="Restaurant Id"
                    size="small"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    value={categoryName}
                    onFocus={()=>handleError(false,'categoryName','')}
                    error={resError?.categoryName?.error}
                    helperText={resError?.categoryName?.message}
                    label="Category Name"
                    size="small"
                    fullWidth
                    onChange={(event)=>setCategoryName(event.target.value)}
                 />
            </Grid>
            <Grid item xs={12}>
                <Button component="label" variant="contained" fullWidth endIcon={<UploadFile/>}>
                    <input
                        onFocus={()=>handleError(false,'icon','')}
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleIcon}
                    />
                    Upload Icon
                </Button>
                <div>
                    {resError?.icon?.error?<div style={{color:'red',fontSize:'0.8rem',padding:5}}>{resError?.icon?.message}</div>:<></>}
                </div>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>
                <Avatar
                    variant="rounded"
                    src={icon.url}
                    sx={{ width: 46, height: 46 }}
                />
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleSubmit}>
                    Submit
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleReset}>
                    Reset
                </Button>
            </Grid>

        </Grid>

    </div>
    </div >
    )
}