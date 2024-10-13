import React, { useRef, useState ,useEffect} from 'react'
import "../styles/videoComp.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { connectToSocket } from '../../../backend/src/controllers/socketManager';
import { connect } from 'mongoose';

const server_url  = "http://localhost:3000"
var connections = {}; 
const peerConfigConnections = {
    "iceServers":[
      {"urls": "stun:stun.l.goggle.com:19302"}
    ]
}

function VideoMeet() {
var socketRef = useRef();

let localVideoRef = useRef();

let [videoAvailable , setVideoAvailable] = useState(true);
let [audioAvailable, setAudioAvailable] = useState(true);
let [video,setVideo] = useState();
let [audio,setAudio] = useState(); 
let [screen , setScreen] = useState(); 
let [showModal , setModal] = useState(); 
let [screenAvailable,setScreenAvailable] = useState(); 
let [messages,setMessages] = useState(); 
let [message ,setMessage] = useState(); 
let [newMessages,setNewMessages] =useState(); 
let [askForUsername,setAskForUsername] = useState(true); 
let [username ,setUsername] = useState(); 

const videoRef = useRef([]); 
let [videos,setVideos] = useState([]);

// it takes video and audio permissions
const getPermissions = async ()=>{
    try{
      const videoPermissions = await navigator.mediaDevices.getUserMedia({video:true});
      
      if (videoPermissions){
        setVideoAvailable(true);
      }else{
        setVideoAvailable(false); 
      }
    
      const audioPermissions = await navigator.mediaDevices.getUserMedia({audio:true});
      
      if (audioPermissions){
        setAudioAvailable(true);
      }else{
        setAudioAvailable(false); 
      }

      if(navigator.mediaDevices.getDisplayMedia){
        setScreenAvailable(true);
      }else{
        setScreenAvailable(false);
      }

      if(videoAvailable || audioAvailable){
        const userMediaStream = await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});
        
        if(userMediaStream){
           window.localStream = userMediaStream;
           if(localVideoRef.current){
            localVideoRef.current.srcObject = userMediaStream;
           }
        }
      }
    }
    catch(e){
        console.log(e);
    }
}

useEffect(()=>{
getPermissions();
},[]);

let getUserMedia =()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video , audio:audio})
        .then(getUserMediaSuccess)
        .then((stream)=>{})
        .catch((e)=>{console.log(e)})
    }else{
        try{
          let tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }catch(e){

        }
    }
}

useEffect(()=>{
    if(video !== undefined && audio !== undefined){
        getUserMedia();
    }
},[audio,video])

let getMedia = ()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);

    connectToSocketServer(); 
}

  return (
    <div>
      {askForUsername === true ? 
       <div>
        <h2>Enter into lobby</h2>
        <TextField id="outlined-basic" label="Username" value={username} onChange={e =>setUsername(e.target.value)} variant="outlined" />
        <Button variant="contained" onClick={connect}>Connect</Button>

        <div>
            <video ref={localVideoRef} autoPlay muted></video>
        </div>
       </div> : <></>}
    </div>
  )
}

export default VideoMeet
