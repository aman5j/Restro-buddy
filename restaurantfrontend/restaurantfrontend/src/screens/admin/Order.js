import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../../components/Title';
import { useState,useEffect } from "react"
import { postData,getData } from "../../services/FetchNodeServices"
import MaterialTable from "@material-table/core"
import { useNavigate } from 'react-router-dom';


// Generate Order Data

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
    var navigate = useNavigate()
    const getCurrentDate=()=>{
    const date=new Date();
    const cd=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    return cd; 
    }
    const [listbill,setListBill]=useState([])
    const [from,setFrom]=useState(getCurrentDate());
    const [to,setTo]=useState(getCurrentDate());

  
    const fetchFilteredBill=async()=>{
        var result = await postData('billing/display_all_bills_by_billdate',{from:from,to:(to || getCurrentDate())})
        setListBill(result.data)
        console.log(result.data)
    }

    useEffect(function(){
        fetchFilteredBill()
    },[])

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Billno</TableCell>
            <TableCell>BillDate</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Tableno</TableCell>
            <TableCell>Server</TableCell>
            <TableCell>Mobileno</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listbill.map((row) => (
            <TableRow key={row.billno}>
              <TableCell>{row.billno}</TableCell>
              <TableCell>{row.billdate}/{row.billtime}</TableCell>
              <TableCell>{row.customername}/{row.mobileno}</TableCell>
              <TableCell>{row.tableno}</TableCell>
              <TableCell>{row.waitername}</TableCell>
              <TableCell>{row.mobileno}</TableCell>
              <TableCell align="right">{`${row.totalamount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={()=>navigate('/admindashboard/allsales')} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}