import { makeStyles } from "@mui/styles"
import MaterialTable from "@material-table/core"
import { useState,useEffect } from "react"
import { getData,postData, serverURL } from "../../services/FetchNodeServices"
import { Dialog, DialogActions, DialogContent} from "@mui/material"
import { FormControl, FormControlLabel, Grid,Radio,RadioGroup,TextField,Button,Avatar, FormLabel } from "@mui/material";
import { UploadFile } from "@mui/icons-material"
import Heading from "../../components/heading/Heading"
import { useNavigate } from "react-router-dom"
import restauranticon from '../../assets/logo.png'

import Swal from "sweetalert2"

const useStyles = makeStyles({
    rootdisplay:{
        width:'auto',
        height:'100vh',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    boxdisplay:{
        width:'auto',
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12,
    },
    root:{
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    box:{
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12,
    },
})
export default function DisplayAllWaiter()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [waiterList,setWaiterList]=useState([])
    const [open,setOpen]=useState(false)
    const [waiterId,setWaiterId]=useState('')
    const [btnStatus,setBtnStatus]=useState('')
    const [tempFile,setTempFile]=useState('')
    const navigate = useNavigate()

    /* /////////////////////////////////////// Waiter Data /////////////////////////////// */
    const [restaurantId,setRestaurantId]=useState('')
    const [waiterName,setWaiterName]=useState('')
    const [gender,setGender]=useState('')
    const [dob,setDob]=useState('')
    const [mobileNo,setMobileNo]=useState('')
    const [emailId,setEmailId]=useState('')
    const [address,setAddress]=useState('')
    const [picture,setPicture]=useState({url:'',bytes:''})
    const [resError,setResError]=useState({url:'',bytes:''})

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
        if(!mobileNo)
        {
            handleError(true,'mobileNo',"Pls Input Mobile Number")
            submitRecord=false
        }
        if(!emailId)
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
        var body = {
        'restaurantid':restaurantId,
        'waitername':waiterName,
        'gender':gender,
        'dob':dob,
        'mobileno':mobileNo,
        'emailid':emailId,
        'address':address,
        'waiterid':waiterId
        }
        var result = await postData('waiter/waiter_edit_data',body)
        if(result.status)
        {
            Swal.fire({
                icon:'success',
                title: 'Waiter Register',
                position:'top-end',
                text: result.message,
                timer:3000,
                showConfirmButton:false,
                toast:true,
            })
        }
        else 
        {
            Swal.fire({
                icon:'error',
                title: 'Waiter Register',
                position: 'top-end',
                text: result.message,
                timer: 3000,
                showConfirmButton:false,
                toast:true,
            })
        }
    }
}
    const handlePicture=(event)=>{
        setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        setBtnStatus(true)
        handleError(false,'picture','')
    }

    const handleGender=(event)=>{
        setGender(event.target.value)
        handleError(false,'gender','')
    }





    /* ////////////////////////////////////////// End Waiter Data ////////////////////////// */

    const handleCancel=()=>{
        setBtnStatus(false)
        setPicture({url:tempFile,bytes:''})
    }

    const editImage=async()=>{
        var formData=new FormData()
        formData.append('waiterid',waiterId)
        formData.append('picture',picture.bytes)
        var result = await postData('waiter/waiter_edit_picture',formData)
        if(result.status)
        {
            Swal.fire({
                icon:'success',
                title: 'Edit Picture',
                position:'top-end',
                text: result.message,
                timer:3000,
                showConfirmButton:false,
                toast:true,
            })
        }
        else 
        {
            Swal.fire({
                icon:'error',
                title: 'Edit Picture',
                position:'top-end',
                text: result.message,
                timer:3000,
                showConfirmButton:false,
                toast:true,
            })
        }
    }

    const editDeleteButton=()=>{
        return (<div>
            <Button onClick={editImage}>Edit</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </div>)
    }

    const showData=()=>{
        return(<div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"Waiter Register"} myroute={'/admindashboard/displayallwaiter'} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            disabled
                            size="small" 
                            label="Restaurant Id" 
                            value={restaurantId}
                            fullWidth 
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'waiterName','')}
                            error={resError?.waiterName?.error}
                            helperText={resError?.waiterName?.message}
                            size="small" 
                            label="Waiter Name" 
                            value={waiterName}
                            fullWidth onChange={(event)=>setWaiterName(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup row>
                                <FormControlLabel checked={gender === 'male'}  onChange={handleGender} value={"male"} label="Male" control={<Radio size="small"/>} />
                                <FormControlLabel checked={gender === 'female'} onChange={handleGender} value={"female"} label="Female" control={<Radio size="small"/>}/>
                            </RadioGroup>
                        </FormControl>
                        <div>
                            {resError?.gender?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.gender?.message}</div> :  <></>}
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'dob','')}
                            error={resError?.dob?.error}
                            helperText={resError?.dob?.message}
                            onChange={(event)=>setDob(event.target.value)} 
                            type="date" 
                            fullWidth 
                            value={dob}
                            size="small" 
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'mobileNo','')}
                            error={resError?.mobileNo?.error}
                            helperText={resError?.mobileNo?.message}
                            size="small" 
                            label="Mobile Number"
                            value={mobileNo} 
                            fullWidth onChange={(event)=>setMobileNo(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            onFocus={()=>handleError(false,'emailId','')}
                            error={resError?.emailId?.error}
                            helperText={resError?.emailId?.message}
                            size="small" 
                            label="Email Address" 
                            fullWidth 
                            value={emailId}
                            onChange={(event)=>setEmailId(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            onFocus={()=>handleError(false,'address','')}
                            error={resError?.address?.error}
                            helperText={resError?.address?.message}
                            size="small" 
                            label="Address" 
                            fullWidth 
                            value={address}
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
                        <div>
                            { btnStatus ? editDeleteButton() : <></>}
                        </div>
                    </Grid>
                    
    
                </Grid>
            </div>
    
        </div>)
    
    }

    const fetchAllWaiter=async()=>{
        var result = await postData('waiter/fetch_all_waiters',{'restaurantid':admin.restaurantid})
        setWaiterList(result.data)
    }

    const handleDialogClose=()=>{
        setOpen(false)
        fetchAllWaiter()
    }

    const showDataForEdit=()=>{
        return(<div>
            <Dialog
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

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setWaiterId(rowData.waiterid)
        setWaiterName(rowData.waitername)
        setGender(rowData.gender)
        setDob(rowData.dob)
        setMobileNo(rowData.mobileno)
        setEmailId(rowData.emailid)
        setAddress(rowData.address)
        setPicture({url:`${serverURL}/images/${rowData.picture}`,bytes:''})
        setTempFile(`${serverURL}/images/${rowData.picture}`)

        setOpen(true)
    }

    useEffect(function(){
        fetchAllWaiter()
    },[])

    const handleDelete=(rowData)=>{
        Swal.fire({
            title: 'Do you want to delete the record?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var body = {'waiterid':rowData.waiterid}
                result = await postData('waiter/waiter_delete',body)
              if(result.status)
              {
                Swal.fire('Deleted!', '', result.message)
                fetchAllWaiter()
              }
              else 
                Swal.fire('Fail!', '', result.message)
    
            } else if (result.isDenied) {
              Swal.fire('Waiter not Delete', '', 'info')
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
                    Waiter List
                </div>
            </div>
        }
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'Waiter Id', field: 'waiterid' },
              { title: 'Waiter Name', 
                render: rowData=> <><div>{rowData.waitername}</div><div>({rowData.gender})</div></>    
              },
              { title: 'Birthdate', field: 'dob' },
              { title: 'Contact Details',
                render: rowData=> <><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></>
              },
              { title: 'Address', field: 'address'},
              { title: 'Picture', 
                render: rowData=> <div><img src={`${serverURL}/images/${rowData.picture}`} style={{width:40,height:40}}/></div>
              },
              
            ]}
            data={waiterList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Waiter',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Waiter',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Waiter',
                isFreeAction: true,
                onClick: (event, rowData) => navigate('/admindashboard/waiterinterface')
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