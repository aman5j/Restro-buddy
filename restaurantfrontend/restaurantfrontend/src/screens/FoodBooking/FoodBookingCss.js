import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root:{
        width: 'auto',
        height: 'auto',
        background: '#dfe4ea',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        padding:10,
        paddingTop:30,
    },
    box:{
        width:'92%',
        height:'auto',
        borderRadius:10,
        border:'solid',
        borderColor:'#dff9fb',
        background:'#fff',
        padding:15,
        marginBottom:10
    },
    tablebox:{
        width:'92%',
        height:'auto',
        borderRadius:10,
        border:'solid',
        borderColor:'#dff9fb',
        background:'#fff',
        padding:15,
    },
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
})