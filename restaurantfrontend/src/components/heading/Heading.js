import logo from '../../assets/logo.png'
import list from '../../assets/list.png'
import { useNavigate } from 'react-router-dom'

export default  function Heading({title,myroute})
{   var navigate = useNavigate()
    return(
        <div style={{fontFamily:'Kanit',
            fontWeight:'bold',
            fontSize:20,
            letterSpacing:1,
            display:'flex',
            flexDirection:'row',
            justifyContent: 'space-between',
            alignItems:'center',
       }}>
        <img src={logo} width="60"/>
        <div>{title}</div>
        <img src={list} width="40" style={{marginLeft: 'auto',cursor:'pointer'}} onClick={()=> navigate(`${myroute}`)}/>
        </div>


    )
}