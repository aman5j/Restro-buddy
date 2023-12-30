import { useState,useEffect } from "react"
import { postData,getData } from "../../services/FetchNodeServices"
import MaterialTable from "@material-table/core"
import { Grid,Button } from "@mui/material";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";


import { makeStyles } from "@mui/styles";
var useStyles=makeStyles({
    root:{
        width: 'auto',
        height: 'auto',
        background: '#dfe4ea',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        padding:10
    },
    box:{
      width:'85%',
      height:'auto',
      background:'#f1f2f6',
      padding:10,
      margin:10,
      borderRadius:10
   },
   filerbox:{
    width:'84%',
        height:'auto',
        borderRadius:10,
        background:'#fff',
        padding:15,
        marginBottom:10
   },
   center:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
   },
   Heading:{
    fontSize:16,
    fontFamily:'Kanit',
    fontWeight:'bold'
   }
  
  })
  
export default function AllSales()
{   var useStyle = useStyles()
    const getCurrentDate=()=>{
        const date=new Date();
        const cd=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        return cd; 
      }
    const [listbill,setListBill]=useState([])
    const [totalAmount,setTotalAmount]=useState(0)
    const [from,setFrom]=useState(getCurrentDate());
    const [to,setTo]=useState(getCurrentDate());
      
    const fetchTotalAmount=async()=>{
        var result = await postData('billing/fetch_total',{from:from,to:(to || getCurrentDate())})
        
        setTotalAmount(result.data)  
    }

    const fetchFilteredBill=async()=>{
        var result = await postData('billing/display_all_bills_by_billdate',{from:from,to:(to || getCurrentDate())})
        setListBill(result.data)
        console.log(result.data)
    }

    useEffect(function(){
        fetchTotalAmount()
        fetchFilteredBill()
    },[])

    const handleFrom=(event)=>{
        const m=String(Number(event.$M)+1);
        const d=String(event.$D);
        const y=String(event.$y);
        setFrom(y+"-"+m+"-"+d);   
      }
    
      const handleTo=(event)=>{
        const m=String(Number(event.$M)+1);
        const d=String(event.$D);
        const y=String(event.$y);
        setTo(y+"-"+m+"-"+d);   
      }

      const handleFilter=()=>{
        fetchFilteredBill()
        fetchTotalAmount()
      }
   

    const showBills=()=>{
            return (
              <MaterialTable
                title="All Sales"
                columns={[
                  { title: 'billno', field: 'billno' },
                  { title: 'billdate', render: rowData=> <><div>{rowData.billdate}</div><div>{rowData.billtime}</div></> },
                  { title: 'Customer Name', render: rowData=> <><div>{rowData.customername}</div>{rowData.mobileno}</> },
                  { title: 'Table No', field: 'tableno' },
                  { title: 'server', field: 'server' },
                  { title: 'mobileno', field: 'mobileno' },
                  { title: 'Amount',render: rowData=> <>&#8377; {rowData.totalamount}</> },
                  
                ]}
                data={listbill}   
                options={{
                    paging:true,
                    pageSize:3,       // make initial page size
                    emptyRowsWhenPaging: false,   // To avoid of having empty rows
                    pageSizeOptions:[3,5,7],    // rows selection options
                  }}     
                
              />
            )
    }

    return(<div className={useStyle.root}>
        <div className={useStyle.filerbox}>
            <Grid container spacing={3} style={{display:'flex',alignItems:'center'}}>
                
                <Grid item xs={3} style={{display:'flex',alignItems:'center',flexDirection:'column',fontFamily:'kanit',fontSize:18,fontWeight:'bold'}}>
                    <div>
                        Total Sales
                    </div>
                    <div style={{fontSize:24}}>
                        &#8377; {parseFloat(totalAmount.totalbill).toFixed(2)}
                    </div>
                </Grid>

                <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>        
                      <DatePicker
                        label="FROM"
                        format="DD-MM-YYYY"
                        defaultValue={dayjs(getCurrentDate())}
                        onChange={handleFrom}                      
                      />
                    </DemoContainer>
                </LocalizationProvider>
                </Grid>

                <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>        
                      <DatePicker
                        label="To"
                        format="DD-MM-YYYY"
                        defaultValue={dayjs(getCurrentDate())}
                        onChange={handleTo}
                      />
                    </DemoContainer>
                </LocalizationProvider>
                </Grid>

                <Grid item xs={3} style={{display:'flex',alignItems:'center'}}>
                    <Button variant="contained" fullWidth onClick={handleFilter}>Search Bill</Button>
                </Grid>

            </Grid>
        </div>
        <div className={useStyle.box}>
        {showBills()}
         </div>
    </div>)
}