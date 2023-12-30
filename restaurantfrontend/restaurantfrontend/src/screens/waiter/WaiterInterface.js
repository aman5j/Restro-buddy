import { makeStyles } from "@mui/styles";
import { FormControl, FormControlLabel, Grid,Radio,RadioGroup,TextField,Button,Avatar, FormLabel } from "@mui/material";
import Heading from "../../components/heading/Heading";
import { UploadFile } from "@mui/icons-material";
import { useState,useEffect } from "react";
import { postData } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";


const useStyles = makeStyles({
    root:{
        width:'auto',
        height:'100vh',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    box:{
        width:'60%',
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12,
    },
})
export default function WaiterInterface()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    /////////////use states ////////////////////////////
    const [restaurantId,setRestaurantId]=useState('')
    const [waiterName,setWaiterName]=useState('')
    const [gender,setGender]=useState('')
    const [dob,setDob]=useState('')
    const [mobileNo,setMobileNo]=useState('')
    const [emailId,setEmailId]=useState('')
    const [address,setAddress]=useState('')
    const [picture,setPicture]=useState({url:'',bytes:''})
    const [resError,setResError]=useState({url:'',bytes:''})
    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleReset=()=>{
        setWaiterName('')
        setGender('')
        setDob('')
        setMobileNo('')
        setEmailId('')
        setAddress('')
        setPicture('')
    }

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord=true 
        if(!restaurantId)
        {
            handleError(true,'restaurantId',"Pls Input Restaurantid")
            submitRecord=false
        }
        if(!waiterName)
        {
            handleError(true,'waiterName',"Pls Input Waiter Name")
            submitRecord=false
        }
        if(!gender)
        {
            handleError(true,'gender',"Pls Input Gender")
            submitRecord=false
        }
        if(!dob)
        {
            handleError(true,'dob',"Pls Input BirthDate")
            submitRecord=false
        }
        if(!mobileNo || !(/^[0-9]{10}$/).test(mobileNo))
        {
            handleError(true,'mobileNo',"Pls Input Mobile Number")
            submitRecord=false
        }
        if(!emailId || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)))
        {
            handleError(true,'emailId',"Pls Input Email Id")
            submitRecord=false
        }
        if(!address)
        {
            handleError(true,'address',"Pls Input Address")
            submitRecord=false
        }
        if(!picture.url)
        {
            handleError(true,'picture',"Pls Upload Waiter Picture")
            submitRecord=false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation())
        {
        var formData = new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('waitername',waiterName)
        formData.append('gender',gender)
        formData.append('dob',dob)
        formData.append('mobileno',mobileNo)
        formData.append('emailid',emailId)
        formData.append('address',address)
        formData.append('picture',picture.bytes)
        var result = await postData('waiter/waiter_submit',formData)
        if(result.status)
        {
            Swal.fire({
                icon:'success',
                title: 'Waiter Register',
                text: result.message,
            })
        }
        else 
        {
            Swal.fire({
                icon:'error',
                title: 'Waiter Register',
                text: result.message,
            })
        }
    }
}
    const handlePicture=(event)=>{
        setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        handleError(false,'picture','')
    }

    const handleGender=(event)=>{
        setGender(event.target.value)
        handleError(false,'gender','')
    }


    

    return(<div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Heading title={"Waiter Register"} myroute={'/admindashboard/displayallwaiter'}/>
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
                    <TextField 
                        value={waiterName}
                        onFocus={()=>handleError(false,'waiterName','')}
                        error={resError?.waiterName?.error}
                        helperText={resError?.waiterName?.message}
                        size="small" 
                        label="Waiter Name" 
                        fullWidth onChange={(event)=>setWaiterName(event.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row>
                            <FormControlLabel onChange={handleGender} value={"male"} label="Male" control={<Radio size="small"/>} />
                            <FormControlLabel onChange={handleGender} value={"female"} label="Female" control={<Radio size="small"/>}/>
                        </RadioGroup>
                    </FormControl>
                    <div>
                        {resError?.gender?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.gender?.message}</div> :  <></>}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={dob}
                        onFocus={()=>handleError(false,'dob','')}
                        error={resError?.dob?.error}
                        helperText={resError?.dob?.message}
                        onChange={(event)=>setDob(event.target.value)} 
                        type="date" 
                        fullWidth 
                        size="small" 
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={mobileNo}
                        onFocus={()=>handleError(false,'mobileNo','')}
                        error={resError?.mobileNo?.error}
                        helperText={resError?.mobileNo?.message}
                        size="small" 
                        label="Mobile Number" 
                        fullWidth onChange={(event)=>setMobileNo(event.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={emailId}
                        onFocus={()=>handleError(false,'emailId','')}
                        error={resError?.emailId?.error}
                        helperText={resError?.emailId?.message}
                        size="small" 
                        label="Email Address" 
                        fullWidth 
                        onChange={(event)=>setEmailId(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        value={address}
                        onFocus={()=>handleError(false,'address','')}
                        error={resError?.address?.error}
                        helperText={resError?.address?.message}
                        size="small" 
                        label="Address" 
                        fullWidth 
                        onChange={(event)=>setAddress(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button component="label" variant="contained" fullWidth endIcon={<UploadFile/>}>
                        <input
                        hidden
                        multiple
                        type="file"
                        accept="image/*"
                        onChange={handlePicture}
                        />
                        Upload Waiter Picture
                    </Button>
                    {resError?.picture?.error ? <div style={{fontSize:'0.8rem',paddingLeft:5,color:'red'}}>{resError?.picture?.message}</div> : <></>}
                </Grid>
                <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>
                    <Avatar
                    variant="rounded"
                    src={picture.url}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleSubmit} variant="contained" fullWidth>Submit</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleReset} variant="contained" fullWidth>Reset</Button>
                </Grid>
                
            </Grid>
        </div>

    </div>)

}