import { Grid,Avatar,TextField, Dialog,DialogActions,DialogContent,Button } from "@mui/material";
import { makeStyles } from "@mui/styles"
import MaterialTable from "@material-table/core";
import { useState } from "react";
import Swal from "sweetalert2";
import { UploadFile } from "@mui/icons-material";
import Heading from "../../components/heading/Heading";
import { getData,postData, serverURL } from "../../services/FetchNodeServices";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    rootdisplay: {
        width:'auto',
        height:'auto',
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxdisplay: {
        width:'auto',
        height: 'auto',
        background:'#fff',
        padding: 15,
        borderRadius: 10,
        marginTop:25,
    },
    root: {
        background: '#dfe4ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        height: 'auto',
        background:'#fff',
        padding: 12,
        borderRadius: 10
    }
});
export default function DisplayAllCategory()
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [categorylist,setCategoryList]=useState([])
    const [open,setOpen]=useState(false)
    const [categoryId,setCategoryId]=useState('')
    const [btnStatus,setBtnStatus]=useState(false)
    const [tempFile,setTempFile]=useState('')
    const navigate = useNavigate()

    /* ///////////////////////////////// Category Data //////////////////////////////////// */
    const [restaurantId,setRestaurantId]=useState('')
    const [categoryName,setCategoryName]=useState('')
    const [icon,setIcon]=useState({url:'',bytes:''})
    const [resError,setResError]=useState({icon:''})

    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        setBtnStatus(true)
        handleError(false,'icon','')
    }

    const handleError=(error,input,message)=>{
        setResError((prevError)=>({...prevError, [input]:{'error':error,'message':message}}))
        console.log("CC",resError)
    }

    const validation=()=>{
        var submitRecord = true 
        if(!restaurantId)
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
        var body={
            'restaurantid':restaurantId,
            'categoryname':categoryName,
            'categoryid':categoryId}
        
        var result = await postData('category/category_edit_data',body)
        if(result.status)
        {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 1500,
                toast:true
                
              })
              fetchAllCategory()
        }
        else 
        {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 1500,
                toast:true
                
              })
        }
    }
}


    /* /////////////////////////////////////End Category Data ///////////////////////////  */

    const fetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_categories',{'restaurantid':admin.restaurantid})
        setCategoryList(result.data)
    }

    const handleCancel=()=>{
        setIcon({url:tempFile.icon,bytes:''})
        setBtnStatus(false)
    }

    const editImage=async()=>{
        var formData = new FormData()
        formData.append('categoryid',categoryId)
        formData.append('icon',icon.bytes)
        var result = await postData('category/category_edit_icon',formData)
        if(result.status)
        {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 1500,
                toast:true
                
              })

        }
        else
        {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: result.message,
                showConfirmButton: false,
                timer: 1500,
                toast:true
              })
        }
        setBtnStatus(false)
    }

    const editDeleteButton=()=>{
        return(<div>
            <Button onClick={editImage}>Edit</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </div>)
    }

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setCategoryName(rowData.categoryname)
        setCategoryId(rowData.categoryid)
        setIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
        setTempFile({icon:`${serverURL}/images/${rowData.icon}`})
        

        setOpen(true)
    }

    const showData=()=>{
        
    return (
        <div className={classes.root}>
            <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Heading title={"Category Interface"} myroute={'/admindashboard/displayallcategory'} />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        onFocus={()=>handleError(false,'restaurantId','')}
                        error={resError?.restaurantId?.error}
                        helperText={resError?.restaurantId?.message}
                        disabled
                        label="Restaurant Id"
                        fullWidth
                        value={restaurantId}
                        onChange={(event)=>setRestaurantId(event.target.value)}
                     />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onFocus={()=>handleError(false,'categoryName','')}
                        error={resError?.categoryName?.error}
                        helperText={resError?.categoryName?.message}
                        label="Category Name"
                        fullWidth
                        value={categoryName}
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
                    <div>
                        {btnStatus ? editDeleteButton() :<></>}
                    </div>
                </Grid>
                
    
            </Grid>
    
        </div>
        </div >
        )
    }

    const handleDialogClose=()=>{
        fetchAllCategory()
        setOpen(false)
    }

    const showDataForEdit=()=>{
        return(<div>
            <Dialog
                maxWidth={'xs'}
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
        fetchAllCategory()
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
                var body = {'categoryid':rowData.categoryid}
                var result = await postData('category/category_delete',body)
              if(result.status)
              {
                Swal.fire('Deleted!', '', result.message)
                fetchAllCategory()
              }
              else 
                Swal.fire('Fail!', '', result.message)
    
            } else if (result.isDenied) {
              Swal.fire('Category not Delete', '', 'info')
            }
          })
        
    }

    function displayAll() {
        return (
          <MaterialTable
            title="Category List's"
            columns={[
              { title: 'Restaurant Id', field: 'restaurantid' },
              { title: 'Category ID', field: 'categoryid' },
              { title: 'Category Name', field: 'categoryname' },
              { title: 'Icon', 
                render: rowData=> <div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:40,height:40}}/></div>
              },

              
            ]}
            data={categorylist}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Category',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete User',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Category',
                isFreeAction:true,
                onClick: (event, rowData) => navigate('/admindashboard/categoryinterface')
              }
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