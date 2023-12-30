import {useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Button,Dialog,DialogContent,DialogActions, TextField } from '@mui/material';
import { serverURL, postData } from '../../services/FetchNodeServices';
import { useDispatch, useSelector } from 'react-redux';
export default function FoodComponent(props) {
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [listFood,setListFood]=useState([])
    const [tempListFood,setTempListFood]=useState([])
    const [order,setOrder]=useState([])
    var dispatch=useDispatch()
    var foodOrder = useSelector(state=>state.orderData)

  
    useEffect(function(){
        fetchAllFood()
    },[props])

    const fetchAllFood=async()=>{
        var result = await postData('fooditem/fetch_all_fooditems_categorywise',{'restaurantid':admin.restaurantid,'categoryid':props.categoryid})
        setListFood(result.data)
        setTempListFood(result.data)
    }

    const searchFood=(e)=>{
        var temp=tempListFood.filter((item)=>item.fooditemname.toLowerCase().includes(e.target.value.toLowerCase()))
        setListFood(temp)
    }

    const handleOrder=(item)=>{
        var key=`#${props.floorNo}${props.tableNo}`
        try{
        var foodlist=foodOrder[key]
    
        try{
            foodlist[item.fooditemid].qty=parseInt(foodlist[item.fooditemid].qty)+1
            // alert(foodlist[item.fooditemid].qty)
        }
        catch(e){
        item.qty=1
        foodlist[item.fooditemid]=item
        foodOrder[key]=foodlist
        }


        }
        catch(e)
        {
            var foodlist={}
            item.qty=1
            foodlist[item.fooditemid]=item
            foodOrder[key]={...foodlist}
            // alert('catch:'+JSON.stringify(foodOrder[key]))
        }
        console.log(foodOrder)
        dispatch({type:'ADD_ORDER',payload:[key,foodOrder[key]]})
        props.setRefresh(!props.refresh)

    }

    const showFoodList=()=>{
        return listFood.map((item)=>{
            return(<div>  
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={()=>handleOrder(item)} sx={{height:30,display:'flex',alignItems:'center',padding:3}} alignItems="flex-start">
                        
                        <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`${serverURL}/images/${item.icon}`} sx={{width:30,height:30}} />
                        </ListItemAvatar>
                        
                        <ListItemText
                        primary={item.fooditemname}
                        secondary={item.offerprice>0?<span><s>&#8377;{item.price}</s> <b>&#8377;{item.offerprice}</b></span>: <b>&#8377; {item.price}</b>}
                        />
                    </ListItemButton>
                    {/* <Divider variant="inset" component="li" /> */}
                </List>
            </div>)
        })
    }

    const handleDialogClose=()=>{
        props.setOpen(false)
    }

    const showFoodDialog=()=>{
        return(
            <Dialog
                maxWidth={'sm'}
                open={props.open}>
                <DialogContent>
                    <TextField onChange={((e)=>searchFood(e))} fullWidth label="Search food items.." variant="standard" />
                    {showFoodList()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
  
  
    return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {showFoodDialog()}
    </Box>
  );
}
