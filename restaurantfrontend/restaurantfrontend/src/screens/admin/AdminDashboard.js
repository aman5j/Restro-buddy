import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Grid,Paper,Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { serverURL } from '../../services/FetchNodeServices';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import DeckIcon from '@mui/icons-material/Deck';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PaymentIcon from '@mui/icons-material/Payment';

import { useNavigate } from 'react-router-dom';
import { Route,Routes,Navigate } from 'react-router-dom';
import CategoryInterface from "../../screens/category/CategoryInterface";
import DisplayAllCategory from "../../screens/category/DisplayAllCategory";
import FoodItemInterface from "../../screens/fooditem/FoodItemInterface";
import DisplayAllFoodItem from "../../screens/fooditem/DisplayAllFoodItem";
import TableBookingInterface from "../../screens/tablebooking/TableBookingInterface";
import DisplayAllTableBooking from "../../screens/tablebooking/DisplayAllTableBooking";
import WaiterInterface from "../../screens/waiter/WaiterInterface";
import DisplayAllWaiter from "../../screens/waiter/DisplayAllWaiter";
import WaiterTableInterface from "../../screens/waitertable/WaiterTableInterface";
import DisplayAllWaiterTable from "../../screens/waitertable/DisplayAllWaiterTable";
import FoodBooking from '../FoodBooking/FoodBooking';
import AllSales from '../allsales/AllSales';
import Summary from './Summary';
import Chart from '../../components/DashboardComponent/Chart';

const useStyles = makeStyles({
  leftBarStyle:{
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  nameStyle:{
    fontFamily:'Kanit',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 2,
  },
  emailStyle:{
    fontFamily: 'Kanit',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#636e72'
  },
  phoneStyle:{
    fontFamily: 'Kanit',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#636e72'
  },
  menuStyle:{
    fontFamily: 'Kanit',
    fontSize: 18,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'left',
    width: 220
  },
  menuItemStyle:{
    fontFamily: 'Kanit',
    fontSize: 16,
    fontWeight: 'bold'
  }

})
export default function AdminDashboard() {
    const classes = useStyles()
    const navigate = useNavigate()
    const admin = JSON.parse(localStorage.getItem('ADMIN'))
    const handleLogout=()=>{
      localStorage.clear()
      navigate('/adminlogin')
    }
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color='secondary' >
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            {admin.restaurantname}
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} style={{paddingInlineStart:5}} >
        <Grid item xs={2.2} >
          <Paper className={classes.leftBarStyle}>
            <img src={`${serverURL}/images/${admin.filelogo}`} width='100' />
            <div className={classes.nameStyle}>{admin.ownername}</div>
            <div className={classes.emailStyle}>{admin.emailid}</div>
            <div className={classes.phoneStyle}>+91{admin.mobileno}</div>

            <div className={classes.menuStyle}>
            <List>
            <Divider/>
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/summary')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Dashboard</span>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/displayallfooditem')}>
              <ListItemIcon>
                <FoodBankIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>FoodItem List</span>} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/displayalltablebooking')}>
              <ListItemIcon>
                <TableRestaurantIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>TableBooking List</span>} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/displayallwaiter')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Waiter List</span>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/displayallwaitertable')}>
              <ListItemIcon>
                <DeckIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>WaiterTable List</span>} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/foodbooking')}>
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Billing</span>} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/admindashboard/allsales')}>
              <ListItemIcon>
                <ShowChartIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Sales Report</span>} />
            </ListItemButton>
          </ListItem>


      <Divider variant='inset'/>

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>} />
            </ListItemButton>
          </ListItem>

    </List>

            </div>

          </Paper>
          
        </Grid>

        <Grid item xs={9.8} style={{padding:25,marginTop:25,background:'#dfe4ea',height:'auto'}}>
          
          <Routes>
          <Route path="/" element={<Navigate to="/admindashboard/Summary" replace={true} />}/>
          <Route element={<CategoryInterface/>} path="/categoryinterface" />
          <Route element={<DisplayAllCategory/>} path="/displayallcategory" />
          <Route element={<FoodItemInterface/>} path="/fooditeminterface" />
          <Route element={<DisplayAllFoodItem/>} path="/displayallfooditem" />
          <Route element={<TableBookingInterface/>} path="/tablebookinginterface" /> 
          <Route element={<DisplayAllTableBooking/>} path="/displayalltablebooking" />
          <Route element={<WaiterInterface/>} path="/waiterinterface" /> 
          <Route element={<DisplayAllWaiter/>} path="/displayallwaiter" />
          <Route element={<WaiterTableInterface/>} path="/waitertableinterface" />
          <Route element={<DisplayAllWaiterTable/>} path="/displayallwaitertable" />
          <Route element={<FoodBooking/>} path="/foodbooking" />
          <Route element={<AllSales/>} path="/allsales" />
          <Route element={<Summary/>} path="/summary" />
          </Routes>
        </Grid>
      </Grid>
      
    </Box>

    

  );
}