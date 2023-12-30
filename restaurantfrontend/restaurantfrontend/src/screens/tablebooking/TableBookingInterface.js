import { makeStyles } from '@mui/styles';
import { FormControl, Grid, MenuItem, Select, TextField, InputLabel, Button, FormHelperText } from '@mui/material';
import Heading from '../../components/heading/Heading';
import { useState,useEffect } from 'react';
import Swal from 'sweetalert2';
import { postData } from '../../services/FetchNodeServices';

const useStyles = makeStyles({
    root:{
        width:'auto',
        height:'auto',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    box:{
        width:'60%',
        height:'auto',
        background:'#fff',
        padding:12,
        borderRadius:10,
    }
})
export default function TableBookingInterface()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    ///////?useState ////////////////////////////////////////
    const [restaurantId,setRestaurantId]=useState('')
    const [tableNo,setTableNo]=useState('')
    const [noOfChair,setNoOfChair]=useState('')
    const [floor,setFloor]=useState('')
    const [resError,setResError]=useState('')
    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleReset=()=>{
        setTableNo('')
        setNoOfChair('')
        setFloor('')
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
        if(!tableNo)
        {
            handleError(true,'tableNo','Pls Input Table Number')
            submitRecord=false
        }
        if(!noOfChair || isNaN(noOfChair))
        {
            handleError(true,'noOfChair','Pls Input Number Of Chair')
            submitRecord=false
        }
        if(!floor)
        {
            handleError(true,'floor','Pls Select Floor')
            submitRecord=false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation())
        {
        var body={'restaurantid':restaurantId,'tableno':tableNo,'noofchair':noOfChair,'floor':floor}
        var result = await postData('tablebooking/tablebooking_submit',body)
        if(result.status)
        {
            Swal.fire({
                icon: 'success',
                title: 'TableBooking',
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

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"TableBooking Interface"} myroute={'/admindashboard/displayalltablebooking'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            size='small'
                            value={restaurantId}
                            disabled
                            label="Restaurant Id" 
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl fullWidth>
                    <InputLabel>Floor</InputLabel>
                    <Select
                        size='small'
                        onFocus={()=>handleError(false,'floor','')}
                        error={resError?.floor?.error}
                        label="Floor"
                        value={floor}
                        onChange={(event)=>setFloor(event.target.value)}
                    >
                        <MenuItem>-Select Floor-</MenuItem>
                        <MenuItem value="1st Floor">1st Floor</MenuItem>
                        <MenuItem value="2st Floor">2nd Floor</MenuItem>
                        <MenuItem value="3st Floor">3nd Floor</MenuItem>
                        <MenuItem value="4st Floor">4nd Floor</MenuItem>
                        <MenuItem value="5st Floor">5nd Floor</MenuItem>
                        <MenuItem value="6st Floor">6nd Floor</MenuItem>
                        <MenuItem value="Top Floor">Top Floor</MenuItem>
                    </Select>
                    <FormHelperText style={{color:'red'}}>{resError?.floor?.message}</FormHelperText>
                    </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                            value={tableNo}
                            size='small'
                            onFocus={()=>handleError(false,'tableNo','')}
                            error={resError?.tableNo?.error}
                            helperText={resError?.tableNo?.message}
                            onChange={(event)=>setTableNo(event.target.value)} 
                            label="Table Number" 
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            value={noOfChair}
                            size='small'
                            onFocus={()=>handleError(false,'noOfChair','')}
                            error={resError?.noOfChair?.error}
                            helperText={resError?.noOfChair?.message}
                            onChange={(event)=>setNoOfChair(event.target.value)} 
                            label="Number Of Chair" 
                            fullWidth
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <Button onClick={handleSubmit} variant='contained' fullWidth>Submit</Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button onClick={handleReset} variant='contained' fullWidth>Reset</Button>
                    </Grid>

                </Grid>
            </div>

        </div>
    )
}