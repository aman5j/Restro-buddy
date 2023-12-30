import { useEffect,useState } from "react"
import { TextField,Grid,MenuItem,FormControl,Select,InputLabel,Avatar } from "@mui/material"
import { useStyles } from "./FoodBookingCss"
import { postData,serverURL } from "../../services/FetchNodeServices"
import TableComponent from "../../components/TableComponent/TableComponent"
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent"
import TableCart from "../../components/TableCart/TableCart"

export default function FoodBooking(props)
{   const classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [currentDate,setCurrentDate]=useState('')
    const [waiterList,setWaiterList]=useState([])
    const [waiterId,setWaiterId]=useState('')
    const [waiterName,setWaiterName]=useState('')
    const [floorNo,setFloorNo]=useState('')
    const [tableNo,setTableNo]=useState('')
    const [refresh,setRefresh]=useState(false)

    const getCurrentDate=()=>
    {
        var date = new Date()
        var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
    }
    const getCurrentTime=()=>{
        var time = new Date()
        var ct = time.getHours()+":"+time.getMinutes()
        return ct
    }
    const fetchAllWaiters=async()=>{
        var result = await postData('waiter/fetch_all_waiters',{'restaurantid':admin.restaurantid})
        setWaiterList(result.data)
    }
    useEffect(function(){
        setCurrentDate(getCurrentDate()+" "+getCurrentTime())
        fetchAllWaiters()
    },[])

    const fillWaiters=()=>{
        return waiterList.map((item)=>{
            return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        })
    }

    const handleWaiter=(event,value)=>{
        // console.log("VVVALLLUUE",value.props.children)
        setWaiterName(value.props.children)
        setWaiterId(event.target.value)
    }

    return(<div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={3}>
                
                <Grid item xs={4}>
                    <TextField size="small" label="Current Date" value={currentDate} />
                </Grid>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Waiter Name</InputLabel>
                        <Select 
                            value={waiterId} 
                            label="Waiter Name" 
                            onChange={handleWaiter} 
                        >
                            <MenuItem>-Select Waiter-</MenuItem>
                            {fillWaiters()}
                        </Select>
                        {/* { resError?.waiterId?.error ? <div style={{fontSize:'0.8rem',color:'red',paddingLeft:5}}>{resError?.waiterId?.message}</div> : <></>} */}
                    </FormControl>
                </Grid>
                <Grid item xs={4} style={{fontFamily:'kanit',fontWeight:'bold',fontSize:32,textAlign:'right',color:'#273c75'}}>
                    {floorNo} {tableNo.length!=0?<>Table {tableNo}</>:<></>}
                </Grid>
            </Grid>
        </div>
        
        <div className={classes.tablebox}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <CategoryComponent tableNo={tableNo} floorNo={floorNo} refresh={refresh} setRefresh={setRefresh} />
                </Grid>
                <Grid item xs={4}>
                <TableComponent floorNo={floorNo} tableNo={tableNo} setFloorNo={setFloorNo} setTableNo={setTableNo} />
                </Grid>
                <Grid item xs={5}>
                    <TableCart waiterName={waiterName} tableNo={`#${floorNo}${tableNo}`} refresh={refresh} setRefresh={setRefresh} />
                </Grid>
            </Grid>
        </div>

        <div style={{background:'#dfe4ea',width:100,height:100}}>

        </div>
        

    </div>)
}