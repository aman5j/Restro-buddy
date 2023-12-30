import { useState,useEffect } from "react"

export default function Plusminus(props)
{
    const [value,setValue]=useState(0)
    useEffect(function(){
        setValue(props.qty)
    },[props])
    // alert(props.qty)

    const handlePlus=()=>{
        var c=value+1
        setValue(c)
        props.onChange(c)
    }
    const handleMinus=()=>{
        if(value>0)
        {
        var c=value-1
        setValue(c)
        props.onChange(c)
        }
    }


    return(<div style={{display:'flex',margin:2,flexDirection:'row',width:60}}>
        <div onClick={handleMinus} style={{width:12,color:'#fff',background:'#aaa69d',display:'flex',justifyContent:'center',alignItems:'center',fontWeight:'bold',cursor:'pointer'}}>-</div>
        <div style={{width:20,display:'flex',justifyContent:'center',alignItems:'center'}}>{value}</div>
        <div onClick={handlePlus} style={{width:12,color:'#fff',background:'#aaa69d',display:'flex',justifyContent:'center',alignItems:'center',fontWeight:'bold',cursor:'pointer'}}>+</div>
    </div>)
}