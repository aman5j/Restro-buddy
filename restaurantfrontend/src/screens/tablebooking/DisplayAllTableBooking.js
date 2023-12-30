import MaterialTable from '@material-table/core';
import { FormControl, Grid, MenuItem, Select, TextField, InputLabel, FormHelperText } from '@mui/material';
import Heading from '../../components/heading/Heading';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getData,postData,serverURL } from '../../services/FetchNodeServices';
import { Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import restauranticon from '../../assets/logo.png'

const useStyles = makeStyles({
    rootdisplay:{
        width:'auto',
        height:'100vh',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    boxdisplay:{
        width:'auto',
        height:'auto',
        background:'#fff',
        borderRadius:10,
        padding:12
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
        padding:12,
        borderRadius:10,
    }
})
export default function DisplayAllTableBooking()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [tableBookingList,setTableBookingList]=useState([])
    const [open,setOpen]=useState(false)
    const [tableId,setTableId]=useState('')
    const navigate = useNavigate()

    /*////////////////////////////////Table Booking Data ///////////////////////////// */
    const [restaurantId,setRestaurantId]=useState('')
    const [tableNo,setTableNo]=useState('')
    const [noOfChair,setNoOfChair]=useState('')
    const [floor,setFloor]=useState('')
    const [resError,setResError]=useState('')

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord=true 
        if(!restaurantId)
        {
            handleError(true,'restaurantId','Pls Input Restaurant Id')
            submitRecord=false
        }
        if(!tableNo)
        {
            handleError(true,'tableNo','Pls Input Table Number')
            submitRecord=false
        }
        if(!noOfChair)
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
        var body={'restaurantid':restaurantId,'tableno':tableNo,'noofchair':noOfChair,'floor':floor,'tableid':tableId}
        var result = await postData('tablebooking/tablebooking_edit_data',body)
        if(result.status)
        {
            Swal.fire({
                icon: 'success',
                title: 'TableBooking',
                position: 'top-end',
                text: result.message,
                showConfirmButton: false,
                timer: 3000,
                toast: true
              })
        }
        else 
        {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                position: 'top-end',
                text: result.message,
                timer: 3000,
                toast: true
              })
        }
    }
}



    /*//////////////////////////////////End TableBooking ////////////////////////////// */

    const fetchAllTableBooking=async()=>{
        var result = await postData('tablebooking/fetch_all_tablebooking',{'restaurantid':admin.restaurantid})
        setTableBookingList(result.data)
    }

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setTableNo(rowData.tableno)
        setNoOfChair(rowData.noofchair)
        setFloor(rowData.floor)
        setTableId(rowData.tableid)       

        setOpen(true)
    }

    const showData=()=>{
        return(
            <div className={classes.root}>
                <div className={classes.box}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Heading title={"TableBooking Interface"} myroute={'/admindashboard/displayalltablebooking'} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                disabled
                                label="Restaurant Id" 
                                value={restaurantId}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                onFocus={()=>handleError(false,'tableNo','')}
                                error={resError?.tableNo?.error}
                                helperText={resError?.tableNo?.message}
                                onChange={(event)=>setTableNo(event.target.value)} 
                                label="Table Number"
                                value={tableNo} 
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                onFocus={()=>handleError(false,'noOfChair','')}
                                error={resError?.noOfChair?.error}
                                helperText={resError?.noOfChair?.message}
                                onChange={(event)=>setNoOfChair(event.target.value)} 
                                label="Number Of Chair"
                                value={noOfChair} 
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl fullWidth>
                        <InputLabel>Floor</InputLabel>
                        <Select
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
    
                        
                    </Grid>
                </div>
    
            </div>
        )
    }

    

    const handleDialogClose=()=>{
        fetchAllTableBooking()
        setOpen(false)
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

    useEffect(function(){
        fetchAllTableBooking()
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
                var body={'tableid':rowData.tableid}
                var result = await postData('tablebooking/tablebooking_delete',body)
              if(result.status)
              {
                Swal.fire('Deleted!', '', result.message)
                fetchAllTableBooking()
              }
              else 
                Swal.fire('Fail!', '', result.message)
    
            } else if (result.isDenied) {
              Swal.fire('Table not Delete', '', 'info')
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
                    TableBooking List
                </div>
            </div>
        }
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'tableid', field: 'tableid' },
              { title: 'NoOfChair', field: 'noofchair' },
              { title: 'Floor', field: 'floor' },
              
            ]}
            data={tableBookingList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit TableBooking',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete TableBooking',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add TableBooking',
                isFreeAction:true,
                onClick: (event, rowData) => navigate('/admindashboard/tablebookinginterface')
              },

            ]}
          />
        )
      }


    return(
        <div className={classes.rootdisplay}>
            <div className={classes.boxdisplay}>
                {displayAll()}
            </div>
                {showDataForEdit()}
        </div>
    )
}