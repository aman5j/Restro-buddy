import { makeStyles } from "@mui/styles"
import Heading from "../../components/heading/Heading"
import { FormControl, Select, Grid,MenuItem,TextField, InputLabel, Button } from "@mui/material"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getData, postData } from "../../services/FetchNodeServices"
const useStyles = makeStyles({
    root:{
        width: 'auto',
        height: '100vh',
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box:{
        width: '60%',
        height: 'auto',
        background: '#fff',
        padding: 12,
        borderRadius: 10,
    },
})

export default function WaiterTableInterface()
{   
    const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    ////////////////use States///////////////////////
    const [restaurantId,setRestaurantId]=useState('')
    const [waiterList,setWaiterList]=useState([])
    const [waiterId,setWaiterId]=useState('')
    const [tableList,setTableList]=useState([])
    const [tableid,settableid]=useState('')
    const [currentDate,setCurrentDate]=useState('')
    const [floor,setFloor]=useState([])
    const [floorNo,setFloorNo]=useState('')
    const [resError,setResError]=useState({})

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const handleReset=()=>{
        setWaiterId('')
        settableid('')
        setCurrentDate('')
    }

    const validation=()=>{
        var submitRecord = true
        if(!restaurantId)
        {
            handleError(true,'restaurantId','Pls Input Restaurant Id')
            submitRecord = false 
        }
        if(!waiterId)
        {
            handleError(true,'waiterId','Pls Input Waiter Id')
            submitRecord = false
        }
        if(!tableid)
        {
            handleError(true,'tableid','Pls Input Table Number')
            submitRecord = false
        }
        if(!floorNo)
        {
            handleError(true,'floorNo','Pls Choose Floor')
            submitRecord = false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation())
        {
        // var d=new Date()
        // var cd = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
        var body={
        'restaurantid':restaurantId,
        'waiterid':waiterId,
        'tableid':tableid,
        'currentdate':currentDate}
        var result = await postData('waitertable/waitertable_submit',body)
        if(result.status)
        {
            Swal.fire({
                icon:'success',
                title: 'WaiterTable Assign',
                text: result.message,
            })
        }
        else 
        {
            Swal.fire({
                icon:'success',
                title: 'WaiterTabe Assign',
                text: result.message,
            })
        }
    }
}

    
    const fetchAllTables=async(fn)=>{
        var result = await postData('tablebooking/fetch_all_table_by_floor',{'restaurantid':admin.restaurantid,'floor':fn})
        setTableList(result.data)
    }

    const fillTables=()=>{
        return tableList.map((item)=>{
            return <MenuItem value={item.tableid}>{item.tableno}</MenuItem>
        })
    }

    

    const fetchAllWaiters=async()=>{
        var result = await postData('waiter/fetch_all_waiters',{'restaurantid':admin.restaurantid})
        setWaiterList(result.data)
    }

    const fillWaiters=()=>{
        return waiterList.map((item)=>{
            return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        })
    }

    const fetchAllFloors=async()=>{
        var result = await postData('tablebooking/fetch_all_floors',{'restaurantid':admin.restaurantid})
        setFloor(result.data)
    }

    const fillFloors=()=>{
        return floor.map((item)=>{
            return <MenuItem value={item.floor}>{item.floor}</MenuItem>
        })
    }

    useEffect(function(){
        fetchAllWaiters()
        fetchAllTables()
        fetchAllFloors()
        setRestaurantId(admin.restaurantid)
    },[])

    const handleFloorChange=(event)=>{
        setFloorNo(event.target.value)
        fetchAllTables(event.target.value)
        handleError(false,'floorNo','')
    }



    return(<div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Heading title={"WaiterTableInterface"} myroute={'/admindashboard/displayallwaitertable'}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        value={restaurantId}
                        disabled
                        size="small" 
                        label="Restaurant Id" fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Waiter Name</InputLabel>
                        <Select 
                            onFocus={()=>handleError(false,'waiterId','')}
                            error={resError?.waiterId?.error}
                            value={waiterId} 
                            label="Waiter Name" 
                            onChange={(event)=>setWaiterId(event.target.value)} 
                        >
                            <MenuItem>-Select Waiter-</MenuItem>
                            {fillWaiters()}
                        </Select>
                        { resError?.waiterId?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.waiterId?.message}</div> : <></>}
                    </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Floor</InputLabel>
                        <Select
                            onFocus={()=>handleError(false,'flooNo','')}
                            error={resError?.floorNo?.error}  
                            value={floorNo} 
                            label="Floor No" 
                            onChange={(event)=> handleFloorChange(event)}
                            >
                            <MenuItem>-Select Floor-</MenuItem>
                            {fillFloors()}
                        </Select>
                            { resError?.floorNo?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.floorNo?.message}</div> : <></>}
                    </FormControl>
                </Grid>


                <Grid item xs={6}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Table Number</InputLabel>
                        <Select
                            onFocus={()=>handleError(false,'tableid','')}
                            error={resError?.tableid?.error}  
                            value={tableid} 
                            label="Table Number" 
                            onChange={(event)=>settableid(event.target.value)}
                            >
                            <MenuItem>-Select Table Number-</MenuItem>
                            {fillTables()}
                        </Select>
                            { resError?.tableid?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.tableid?.message}</div> : <></>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField value={currentDate} onChange={(event)=>setCurrentDate(event.target.value)} type="date" size="small"  fullWidth></TextField>
                </Grid>
                <Grid item xs={6}></Grid>

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