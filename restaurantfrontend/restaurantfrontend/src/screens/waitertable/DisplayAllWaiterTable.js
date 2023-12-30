import { makeStyles } from "@mui/styles"
import MaterialTable from "@material-table/core"
import Heading from "../../components/heading/Heading"
import { FormControl, Select, Grid,MenuItem,TextField, InputLabel, Button } from "@mui/material"
import { getData,postData,serverURL } from "../../services/FetchNodeServices"
import Swal from "sweetalert2"
import { useState,useEffect } from "react"
import { Dialog, DialogActions, DialogContent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import restauranticon from '../../assets/logo.png'


const useStyles = makeStyles({
    rootdisplay:{
        width: 'auto',
        height: '100vh',
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxdisplay:{
        width: 'auto',
        height: 'auto',
        background: '#fff',
        padding: 12,
        borderRadius: 10,
    },
    root:{
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box:{
        height: 'auto',
        background: '#fff',
        padding: 12,
        borderRadius: 10,
    },
})

export default function DisplayAllWaiterTable()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [waiterTableList,setWaiterTableList]=useState([])
    const [open,setOpen]=useState(false)
    const [waiterTableId,setWaiterTableId]=useState('')
    const navigate = useNavigate()

    ////////////////////////////////// WaiterTableData //////////////////////////////////////
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


    /////////////////////////////////////End WaiterTableData /////////////////////////////////

    const showData=()=>{
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
    
                </Grid>
            </div>
        </div>)
    }

    const handleDialogClose=()=>{
        fetchAllWaiterTable()
        setOpen(false)
    }

    const showDataForEdit=()=>{
        return(<div>
            <Dialog
                maxWidth="md"
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
        fetchAllTables(rowData.floor)
        setWaiterTableId(rowData.waitertableid)
        setRestaurantId(rowData.restaurantid)
        setWaiterId(rowData.waiterid)
        setFloorNo(rowData.floor)
        settableid(rowData.tableid)
        setCurrentDate(rowData.currentdate)

        setOpen(true)
    }

    const fetchAllWaiterTable=async()=>{
        var result = await postData('waitertable/fetch_all_waitertables',{'restaurantid':admin.restaurantid})
        setWaiterTableList(result.data)
        console.log("CC",result)
    }

    useEffect(function(){
        fetchAllWaiterTable()
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
                var body={'waitertableid':rowData.waitertableid}
                var result=await postData('waitertable/waitertable_delete',body)
              if(result.status)
              {
                Swal.fire('Deleted!', '', result.message)
                fetchAllWaiterTable()
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
                    WaiterTable List
                </div>
            </div>
        }
            columns={[
              { title: 'Restaurantid', field: 'restaurantid' },
              { title: 'Waitertableid', field: 'waitertableid' },
              { title: 'Waiterid/Name', 
                render: rowData=> <><div><b>({rowData.waiterid})</b>{rowData.waiter_name}</div></> },
              { title: 'TableNo', render: (rowData)=> <><div>{rowData.tableid}</div><div>{rowData.floor},Table{rowData.tableno}</div></> },
              { title: 'CurrentDate', field: 'currentdate' },
              
            ]}
            data={waiterTableList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit WaiterTable',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete WaiterTable',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add WaiterTable',
                isFreeAction: true,
                onClick: (event, rowData) => navigate('/admindashboard/waitertableinterface')
              },

            ]}
          />
        )
      }

    return (<div className={classes.rootdisplay}>
        <div className={classes.boxdisplay}>
            {displayAll()}
        </div>
            {showDataForEdit()}
    </div>)
}