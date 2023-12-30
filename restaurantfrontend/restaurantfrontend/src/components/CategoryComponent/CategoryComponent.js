import {useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { serverURL,getData, postData } from '../../services/FetchNodeServices';
import FoodComponent from '../FoodComponent/FoodComponent';

export default function CategoryComponent(props) {
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [categoryList,setCategoryList]=useState([])
    const [categoryId,setCategoryId]=useState('')
    const [open,setOpen]=useState(false)

    const handleFoodListDialog=(cid)=>{
        setCategoryId(cid)
        setOpen(true)
    }

    useEffect(function(){
        fetchAllCategory()
    },[])

    const fetchAllCategory=async()=>{
        var result = await postData('category/fetch_all_categories',{'restaurantid':admin.restaurantid})
        setCategoryList(result.data)
    }

    const showCategoryList=()=>{
        return categoryList.map((item)=>{
            return(<div>  
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton alignItems="flex-start"  onClick={()=>handleFoodListDialog(item.categoryid)}>
                        <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`${serverURL}/images/${item.icon}`} sx={{width:30,height:30}} />
                        </ListItemAvatar>
                        <ListItemText
                        primary={item.categoryname}
                        />
                    </ListItemButton>
                    <Divider variant="inset" component="li" />
                </List>
            </div>)
        })
    }
  
  
    return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {showCategoryList()}
        <FoodComponent categoryid={categoryId} tableNo={props.tableNo} floorNo={props.floorNo}  setOpen={setOpen} open={open} refresh={props.refresh} setRefresh={props.setRefresh} />
    </Box>
  );
}
