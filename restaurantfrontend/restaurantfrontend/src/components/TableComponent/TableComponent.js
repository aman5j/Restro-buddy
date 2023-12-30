import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { postData } from "../../services/FetchNodeServices"
import { useSelector } from "react-redux"
import { MenuItem, Paper } from "@mui/material"
export default function TableComponent(props)
{   var navigate = useNavigate()
    var foodOrder = useSelector((state)=>state.orderData)
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const [floor,setFloor]=useState([])
    const [tableList,setTableList]=useState([])
    const [selectedFloor,setSelectedFloor]=useState(-1)
    const [selectedTable,setSelectedTable]=useState(-1)

    var foodList=[]
    function calculate(tn)
    {     //  alert(tn)
        var cart=foodOrder[tn]
        // console.log(tn,cart)
            
        if(cart!=undefined)
        {
        foodList=Object.values(cart)

        
        var totalAmount=foodList.reduce(calculateTotal,0)
        var totalOffer=foodList.reduce(calculateTotalOffer,0)
        return(totalAmount-totalOffer)
        }
        else 
        { return 0}
    }    
    
    function calculateTotal(item1,item2){
       return item1+(item2.price*item2.qty)
    }

    function calculateTotalOffer(item1,item2){
        var price=item2.offerprice>0?item2.price*item2.qty:0
        return item1+(price-(item2.offerprice*item2.qty))

    }



    const fetchAllFloors=async()=>{
        const result = await postData('tablebooking/fetch_all_floors',{'restaurantid':admin.restaurantid})
        setFloor(result.data)
    }

    const fetchAllTables=async(fn,i)=>{
        props.setTableNo('')
        props.setFloorNo(fn)
        const result = await postData('tablebooking/fetch_all_table_by_floor',{'restaurantid':admin.restaurantid,'floor':fn})
        setTableList(result.data)
        setSelectedFloor(i)
    }

    const handleTableClick=(item,tn)=>{
        
        props.setTableNo(item.tableno)
        setSelectedTable(tn)
    }

    const showTable=()=>{
        return tableList.map((item,i)=>{
            return(<Paper onClick={()=>handleTableClick(item,i)} elevation={3} style={{borderRadius:5, width:70,height:70,display:'flex',justifyContent:'center',alignItems:'center',padding:5,margin:8,background:i==selectedTable?'#2980b9':'#4bcffa',flexDirection:'column',cursor:'pointer'}}>
            <div style={{fontFamily:'Kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2}}>Table {item.tableno}</div>
            <div style={{fontFamily:'Kanit',fontWeight:'600',fontSize:10,color:'#fff',padding:2}}>Chairs {item.noofchair}</div>
            <div style={{fontFamily:'Kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2}}>&#8377; {calculate(`#${props.floorNo}${item.tableno}`)}</div>

            </Paper>)        
        })
    }


    const showFloor=()=>{
        return floor.map((item,i)=>{
            return(<Paper onClick={()=>fetchAllTables(item.floor,i)} elevation={3} style={{borderRadius:5, width:70,height:70,display:'flex',justifyContent:'center',alignItems:'center',padding:5,margin:8,background:i==selectedFloor?'#27ae60':'#7bed9f',cursor:'pointer'}}>
                <div style={{fontFamily:'Kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2}}>{item.floor}</div>

            </Paper>)
        })
    }

    useEffect(function(){
        fetchAllFloors()
    },[])

    return(
    <div style={{display:'flex',flexDirection:'column',padding:5}}>

    <div style={{display:'flex',flexWrap:'wrap',marginBottom:10}}>
        {showFloor()}
    </div>
    <div style={{display:'flex',flexWrap:'wrap'}}>
        {showTable()}
    </div>

    </div>

    )
}