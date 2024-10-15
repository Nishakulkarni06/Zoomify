import React, { useRef, useState ,useEffect} from 'react'
import styles from "../styles/videoComp.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import { connectToSocket } from '../../../backend/src/controllers/socketManager';
import { io } from 'socket.io-client';
import { IconButton } from '@mui/material';
import VideoCamIcon from '@mui/icons-material/Videocam';
import VideoCamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff'; 
import ScreenShare from '@mui/icons-material/ScreenShare';
import StopScreenShare from '@mui/icons-material/StopScreenShareOutlined';
const description = "Some value"; // Define or retrieve the description value


const server_url  = "http://localhost:3000"
var connections = {}; 
const peerConfigConnections = {
    "iceServers":[
      {"urls": "stun:stun.l.goggle.com:19302"}
    ]
}

function VideoMeet() {
var socketRef = useRef();
const socketIdRef = useRef(null);

let localVideoRef = useRef();

let [videoAvailable , setVideoAvailable] = useState(true);
let [audioAvailable, setAudioAvailable] = useState(true);
let [video,setVideo] = useState(true);
let [audio,setAudio] = useState(); 
let [screen , setScreen] = useState(); 
let [showModal , setModal] = useState(); 
let [screenAvailable,setScreenAvailable] = useState(); 
let [messages,setMessages] = useState(); 
let [message ,setMessage] = useState(); 
let [newMessages,setNewMessages] =useState(); 
let [askForUsername,setAskForUsername] = useState(true); 
let [username ,setUsername] = useState(""); 

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

let getUserMediaSuccess= (stream)=>{
 try{
    console.log("video stream sent");
    if (window.localStream) {
  window.localStream.getTracks().forEach(track => track.stop());
    }
 }catch(e){console.log(e)}
 window.localStream = stream;
 localVideoRef.current.srcObject = stream;

 for(let id in connections){
  if(id === socketIdRef.current) continue ;
  connections[id].addStream(window.localStream);
//   connections[id].setLocalDescription(description)
//   .then(()=>{
//     socketIdRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}));
//   })
//   .catch(e=>console.log(e))
connections[id].createOffer()
  .then((description) => {
    // Set the local description with the created offer
    return connections[id].setLocalDescription(description);
  })
  .then(() => {
    // Emit the SDP to the other peer through the signaling server
    socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }));
  })
  .catch(e => console.log(e));  // Handle any errors that occur

  }
  stream.getTracks().forEach(track => track.onended = ()=>{
    setVideo(false);
    setAudio(false);

    try{
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track =>track.stop())
    }catch(e){console.log(e)}

    let blackSilence = (...args) => new MediaStream([black(...args),silence()]);
    window.localStream = blackSilence(); 
     localVideoRef.current.srcObject =window.localStream;

    for (let id in connections){
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description) 
        .then (()=>{
          socketRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}));
        })
        .catch((e)=>{
          console.log(e);
        })
      })
    }
  })
}

  let silence = ()=>{
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
   ctx.resume();
   return Object.assign(dst.stream.getAudioTracks()[0] ,{enabled:false});
  } 

  let black =({width = 640 , height = 480} = {})=>{
    let canvas = Object.assign(document.createElement("canvas"),{width,height});

    canvas.getContext('2d').fillRect(0,0,width,height);
    let stream  = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0] ,{enabled : false});
  }

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


let connect = () => {
  setAskForUsername(false);
  getMedia();
}

useEffect(()=>{
    if(video !== undefined && audio !== undefined){
        getUserMedia();
    }
},[audio,video])

let gotMessageFromServer = (fromId,message)=>{
 var signal = JSON.parse(message);

 if(fromId !== socketIdRef.current){
  if(signal.sdp){
    connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
    .then(()=>{
      if(signal.sdp.type === "offer"){
        connections[fromId].createAnswer().then((description)=>{
          connections[fromId].setLocalDescription(description).then(()=>{
            socketRef.current.emit("signal",fromId,JSON.stringify({"sdp":connections[fromId].localDescription})
          );
          }).catch( e =>console.log(e))
        }).catch( e =>console.log(e))
      }
    }).catch( e =>console.log(e))
  }
 }
 if(signal.ice){
  connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e))
 }
}

let addMessage = ()=>{

}

let connectToSocketServer = () => {
    // Establish connection to the socket server
    socketRef.current = io.connect(server_url, { secure: false });
  
    // Listen for incoming WebRTC signals (SDP/ICE)
    socketRef.current.on('signal', gotMessageFromServer);
  
    // Handle socket connection event
    socketRef.current.on("connect", () => {
        console.log("Connected to signaling server"); 
      socketRef.current.emit("join-call", window.location.href); // Join call
      socketIdRef.current = socketRef.current.id; // Fix: use lowercase 'id' for socket.io
      
      // Listen for chat messages
      socketRef.current.on("chat-message", addMessage);
  
      // Handle a user leaving
      socketRef.current.on("user-left", (id) => {
        console.log("Disconnected from signaling server"); 
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });
  
      // Handle a user joining
      socketRef.current.on("user-joined", (id, clients) => {
        console.log("User joined:", id, clients);
  
        // Create peer connections for each client
        clients.forEach((socketListId) => {
            console.log("Creating peer connection for:", socketListId);
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
  
          // Handle ICE candidates
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate) {
              console.log("Sending ICE candidate:", event.candidate);
              socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }));
            }
          };
  
          // Handle incoming media streams
          connections[socketListId].onaddstream = (event) => {
            console.log("Received stream from:", socketListId);
            
            // Check if video already exists for this socket ID
            let videoExists = videoRef.current.find(video => video.socketId === socketListId);
            
            if (videoExists) {
              // Update existing video stream
              setVideos((videos) => {
                const updatedVideos = videos.map((video) => (
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                ));
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Add a new video stream
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true
              };
              
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
  
          // Add local stream if available
          if (window.localStream) {
            connections[socketListId].addStream(window.localStream);
          } else {
            // Create a "black and silent" stream if no local stream is available
            const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence(); 
            connections[socketListId].addStream(window.localStream);
            console.log("No local stream available, using black/silent stream.");
          }
        });
  
        // If this is the current user, initiate connections
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue; // Skip self
  
            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.error("Error adding local stream:", e);
            }
  
            // Create and send SDP offer
            connections[id2].createOffer()
              .then((description) => {
                return connections[id2].setLocalDescription(description);
              })
              .then(() => {
                socketRef.current.emit('signal', id2, JSON.stringify({ "sdp": connections[id2].localDescription }));
              })
              .catch((e) => {
                console.error("Error creating offer:", e);
              });
          }
        }
      });
    });
  };
  
let getMedia = ()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);

    connectToSocketServer(); 
}

return (
  <div>
      {askForUsername ? (
          <div>
              <h2>Enter into lobby</h2>
              <TextField
                  id="outlined-basic"
                  label="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  variant="outlined"
              />
              <Button variant="contained" onClick={connect}>Connect</Button>

              <div>
                  <video ref={localVideoRef} autoPlay muted />
              </div>
          </div>
      ) : (
          <div className={styles.meetVideoContainer}>
               <div className="video-container">
                <div className={styles.buttonContainers}>
                   <IconButton style={{color:"white"}} >
                    {(video ===true) ? <VideoCamIcon/> : <VideoCamOffIcon/> }
                   </IconButton>
                   <IconButton style={{color:"white"}} >
                   {(audio === true) ? <MicIcon/> : <MicOffIcon/>}
                   </IconButton>
                   <IconButton style={{color:"red"}} >
                   <CallEndIcon/>
                   </IconButton>
                   <IconButton style={{color:"white"}} >
                   {(screen === true) ? <ScreenShare/> : <StopScreenShare/>}
                   </IconButton>
                </div>
    <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted />
    <div className={styles.conferenceView}>
        {videos.map((video,index) => (
            <div key={index}>
                <video
                    data-socket={video.socketId}
                    ref={ref => {
                        if (ref && video.stream) {
                            ref.srcObject = video.stream; 
                        }
                    }}
                    autoPlay
                />

            </div>
        ))}
    </div>
</div>

          </div>
      )}
  </div>
);
}

export default VideoMeet


