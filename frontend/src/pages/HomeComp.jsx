import React, { useContext } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom';
import { IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore'
import '../styles/home.css'
import { AuthContext } from '../contexts/AuthContext';
function HomeComp(){

let navigate = useNavigate(); 
const [meetingCode,setMeetingCode] = React.useState("");

const {addToUserHistory} = useContext(AuthContext); 
let handleJoinVideoCall = async()=>{
    await addToUserHistory(meetingCode); 
    navigate(`/${meetingCode}`);
} 
    return (
    <div >
       <div className='navbar'>
         <h1>Zommify</h1>
         <div className="nav-comp">

         <IconButton style={{marginRight:"2rem"}} onClick={()=>navigate('/history')}>
            <RestoreIcon/>
            <p>History</p>
        </IconButton>
        <button onClick={()=>{
            localStorage.removeItem("token")
            navigate('/auth')
            }}
            className='logout-button'>Logout</button>
        </div>

       </div>

<div className="main">
      <div className="rightHomeComp">
        <h1>Provide Best Quality Video Call !</h1>
        <div style={{marginLeft:"2rem"}}>
            <TextField placeholder='enter meeting code' onChange={e => setMeetingCode(e.target.value)}></TextField>
            <button  onClick={handleJoinVideoCall} className='join-button'>Join </button>
        </div>
      </div>

      <div className="leftHomeComp">
            <img src='home.jpg'></img>
      </div>
      </div>
    </div>
  )
}

export default withAuth(HomeComp);