import { useState, useEffect } from "react";
import { Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"
import { makeStyles } from '@mui/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import UploadFile from '@mui/icons-material/UploadFile';
import Swal from "sweetalert2";

import { serverURL, getData, postData } from '../../services/FetchNodeServices';
import Heading from "../../components/heading/Heading";

const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "100vh",
    background: '#dfe4ea',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: "60%",
    height: "auto",
    borderRadius: 10,
    background: '#fff',
    padding: 15
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

});

export default function RestaurantInterface() {
  var classes = useStyles()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  const [stateid, setStateId] = useState('')
  const [cityid, setCityId] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailid, setEmailid] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [url, setUrl] = useState('')
  const [fssai, setFssai] = useState('')
  const [gstNo, setGstNo] = useState('')
  const [gstType, setGstType] = useState('')
  const [fileFssai, setFileFssai] = useState({ url: '', bytes: '' })
  const [fileShopAct, setFileShopAct] = useState({ url: '', bytes: '' })
  const [fileLogo, setFileLogo] = useState({ url: '', bytes: '' })
  const [address, setAddress] = useState('');
  const [resError, setResError] = useState({})
  const [password,setPassword]=useState('')

  const handleReset=()=>{
    setStateId('')
    setCityId('')
    setRestaurantName('')
    setOwnerName('')
    setPhoneNumber('')
    setEmailid('')
    setMobileNumber('')
    setUrl('')
    setFssai('')
    setGstNo('')
    setGstType('')
    setFileFssai({ url: '', bytes: '' })
    setFileShopAct({ url: '', bytes: '' })
    setFileLogo({ url: '', bytes: '' })
    setAddress('')
  
  }

  const generatePassword=()=>
  {
     var pwd=parseInt((Math.random()*8999)+1000)
     return pwd
  }


  const handleError = (error, input, message) => {
    setResError(prevState => ({ ...prevState, [input]: { 'error': error, 'message': message } }))
    console.log("CC", resError)
  }

  const validation = () => {
    var submitRecord = true
    if (restaurantName.trim().length == 0) {
      handleError(true, 'restaurantName', "Pls Input Restaurant Name")

      submitRecord = false
    }
    if (ownerName.trim().length == 0) {
      handleError(true, 'ownerName', "Pls Input Owner Name")

      submitRecord = false
    }
    if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber))
    {
      handleError(true, 'mobileNumber', "Pls Input Correct Mobile Number")

      submitRecord = false
    }
    if(!emailid || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid))) 
    {
      handleError(true,'emailid',"Pls Input Correct Email Address") 
      
      submitRecord = false
    }

    if(!address)
    {
      handleError(true,'address',"Pls Input Address")

      submitRecord = false
    }

    if(!stateid)
    {
      handleError(true,'stateid',"Pls Select State")

      submitRecord = false
    }    

    if(!cityid)
    {
      handleError(true, 'cityid', "Pls Select City")

      submitRecord = false 
    }

    if(!fileFssai.url)
    {
      handleError(true,'fileFssai',"Pls Upload Fssai")

      submitRecord = false
    }

    if(!fileShopAct.url)
    {
      handleError(true,'fileShopAct',"Pls Upload ShotAct")

      submitRecord = false 
    }

    if(!fileLogo.url)
    { 
      handleError(true,'fileLogo',"Pls Upload Logo")

      submitRecord = false
    }

    return submitRecord
  }



  const fetchAllStates = async () => {
    var result = await getData('statecity/fetch_all_states')

    setStates(result.data)
  }


  useEffect(function () {

    fetchAllStates()

  }, [])

  const fillState = () => {
    return states.map((item) => {
      return <MenuItem value={item.stateid}>{item.statename}</MenuItem>
    })

  }

  const fetchAllCities = async (stateid) => {
    var body = { stateid: stateid }
    var result = await postData('statecity/fetch_all_cities', body)
    setCities(result.data)
  }

  const fillCities = () => {
    return cities.map((item) => {
      return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>
    })
  }

  const handleStateChange = (event) => {
    setStateId(event.target.value)
    fetchAllCities(event.target.value)
  }

  const handleFssai = (event) => {
    setFileFssai({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    handleError(false,'fileFssai','')
  }

  const handleShopAct = (event) => {
    setFileShopAct({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    handleError(false,'fileShopAct','')
  }

  const handleLogo = (event) => {
    setFileLogo({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    handleError(false,'fileLogo','')
  }

  const handleSubmit = async () => {
    var error = validation()
    // alert(error)
    console.log("After Submit:", resError)
    if (error) {
      var formData = new FormData()
      formData.append('restaurantname', restaurantName)
      formData.append('ownername', ownerName)
      formData.append('phonenumber', phoneNumber)
      formData.append('emailid', emailid)
      formData.append('mobileno', mobileNumber)
      formData.append('address', address)
      formData.append('stateid', stateid)
      formData.append('cityid', cityid)
      formData.append('url', url)
      formData.append('fssai', fssai)
      formData.append('gstno', gstNo)
      formData.append('gsttype', gstType)
      formData.append('filefssai', fileFssai.bytes)
      formData.append('fileshopact', fileShopAct.bytes)
      formData.append('filelogo', fileLogo.bytes)
      formData.append('password',generatePassword())
      var d = new Date()
      var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      formData.append('createdat', cd)
      formData.append('updatedat', cd)
      var result = await postData('restaurants/restaurant_submit', formData)
      if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Restaurant Registration',
          text: result.message,
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message,
        })
      }
    }


  }

  return (
  <div className={classes.root}>
    <div className={classes.box}>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Heading title={"Restaurant Register"} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={restaurantName}
            size="small"
            onFocus={() => handleError(false, 'restaurantName', '')}
            error={resError?.restaurantName?.error}
            helperText={resError?.restaurantName?.message}
            onChange={(event) => setRestaurantName(event.target.value)}
            label="Restaurant Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={ownerName}
            size="small"
            onFocus={() => handleError(false, 'ownerName', '')}
            error={resError?.ownerName?.error}
            helperText={resError?.ownerName?.message}
            onChange={(event) => setOwnerName(event.target.value)}
            label="Owner Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={phoneNumber}
            size="small"
            onChange={(event) => setPhoneNumber(event.target.value)} 
            label="Phone Number" 
            fullWidth 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={mobileNumber}
            size="small"
            onFocus={()=>handleError(false,'mobileNumber','')}
            error={resError?.mobileNumber?.error}
            helperText={resError?.mobileNumber?.message}
            onChange={(event) => setMobileNumber(event.target.value)} 
            label="Mobile Number" 
            fullWidth 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={emailid}
            size="small"
            onFocus={()=>handleError(false,'emailid','')}
            error={resError?.emailid?.error}
            helperText={resError?.emailid?.message}
            onChange={(event) => setEmailid(event.target.value)} 
            label="Email Address" 
            fullWidth 
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            value={address}
            size="small" 
            onFocus={()=>handleError(false,'address','')}
            error={resError?.address?.error}
            helperText={resError?.address?.message}
            onChange={(event) => setAddress(event.target.value)} 
            label="Address" 
            fullWidth 
          />
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel>States</InputLabel>
            <Select 
              onFocus={()=>handleError(false,'stateid','')}
              error={resError?.stateid?.error}
              helperText={resError?.stateid?.message}
              label="States" 
              value={stateid} 
              onChange={handleStateChange}
            >
              <MenuItem>-Select State-</MenuItem>
              {fillState()}
            </Select>
            <FormHelperText style={{color:'red'}}>{resError?.stateid?.message}</FormHelperText>
          </FormControl>
          {/* {resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<></>} */}

        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select 
              onFocus={()=>handleError(false,'cityid','')}
              error={resError?.cityid?.error}
              label="City" value={cityid} 
              onChange={(event) => setCityId(event.target.value)}
            >
              <MenuItem>-Select City-</MenuItem>
              {fillCities()}
            </Select>
            <FormHelperText style={{color:'red'}}>{resError?.cityid?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <TextField value={url} size="small" onChange={(event) => setUrl(event.target.value)} label="URL" fullWidth />
        </Grid>

        <Grid item xs={4}>
          <TextField value={fssai} size="small" onChange={(event) => setFssai(event.target.value)} label="Fssai Number" fullWidth />
        </Grid>
        <Grid item xs={4}>
          <TextField value={gstNo} size="small" onChange={(event) => setGstNo(event.target.value)} label="GST Number" fullWidth />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel>GST Type</InputLabel>
            <Select label="GST Type" value={gstType} onChange={(event) => setGstType(event.target.value)}>
              <MenuItem>-Select Gst Type-</MenuItem>
              <MenuItem value="5 Star">5 Star</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <Button size="small" fullWidth component="label" variant="contained" endIcon={<UploadFile />}>
            <input 
              onFocus={()=>handleError(false,'fileFssai','')}
              onChange={handleFssai} hidden accept="image/*" multiple type="file" />
            Upload Fssai
          </Button>
          {
            resError?.fileFssai?.error?<div style={{color:'red', fontSize:'0.8rem',margin:5}}>{resError?.fileFssai?.message}</div>:<></>
          }

        </Grid>

        <Grid item xs={4}>
          <Button size="small" fullWidth component="label" variant="contained" endIcon={<UploadFile />}>
            <input 
              onFocus={()=>handleError(false,'fileShopAct','')}
              onChange={handleShopAct} hidden accept="image/*" multiple type="file" 
            />
            Upload Shop Act
          </Button>
          {
            resError?.fileShopAct?.error?<div style={{color:'red', fontSize:'0.8rem',margin:5}}>{resError?.fileShopAct?.message}</div>:<></>
          }
        </Grid>

        <Grid item xs={4}>
          <Button size="small" fullWidth component="label" variant="contained" endIcon={<UploadFile />}>
            <input 
              onFocus={()=>handleError(false,'fileLogo','')}
              onChange={handleLogo} hidden accept="image/*" multiple type="file" 
            />
            Upload Logo
          </Button>
          {
            resError?.fileLogo?.error?<div style={{color:'red', fontSize:'0.8rem',margin:5}}>{resError?.fileLogo?.message}</div>:<></>
          }
        </Grid>

        <Grid item xs={4} className={classes.center}>
          <Avatar
            variant='rounded'
            alt="Remy Sharp"
            src={fileFssai.url}
            sx={{ width: 46, height: 46 }}
          />
        </Grid>

        <Grid item xs={4} className={classes.center}>
          <Avatar
            variant='rounded'
            alt="Remy Sharp"
            src={fileShopAct.url}
            sx={{ width: 46, height: 46 }}
          />
        </Grid>

        <Grid item xs={4} className={classes.center}>
          <Avatar
            variant='rounded'
            alt="Remy Sharp"
            src={fileLogo.url}
            sx={{ width: 46, height: 46 }}
          />
        </Grid>

        <Grid item xs={6}>
          <Button size="small" onClick={handleSubmit} variant="contained" fullWidth>Submit</Button>
        </Grid>
        <Grid item xs={6}>
          <Button size="small" onClick={handleReset} variant="contained" fullWidth>Reset</Button>
        </Grid>
      </Grid>
    </div>
  </div>)
}