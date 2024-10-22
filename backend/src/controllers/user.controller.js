import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt , {hash} from "bcrypt";  
import crypto from 'crypto';
import { Meeting } from "../models/meeting.model.js";

const login = async(req,res)=>{
    const {username,password}=req.body;
    if(!username || ! password){
        return res.status(httpStatus.BAD_REQUEST).json({message:"please provide username and password"});
}
try{
  const user = await User.findOne({username});
  if(!user){
    return res.status(httpStatus.NOT_FOUND).json({message:"user not found"}); 
  }

  if(await bcrypt.compare(password,user.password)){
    let token = crypto.randomBytes(20).toString("hex");
    user.token = token ;
    await user.save(); 
    return res.status(httpStatus.OK).json({message:"login successfull",token});
  }
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });

}catch(e){
    return res.status(500).json({message:`somehting went wrong ${e}`})
}
}

const register = async(req,res)=>{
    const {name,username,password} = req.body; 
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User already exists"});
        }
        const hashPassword = await bcrypt.hash(password,10); 
        
        const newUser = new User ({
            name : name ,
            username : username ,
            password : hashPassword
        });

        await newUser.save(); 
        res.status(httpStatus.CREATED).json({message:"new user registered "});
    }catch(e){
        res.json({message:`something went wrong ${e}`});
    }
}

// const getUserHistory = async(req,res)=>{
//     const {token} = req.query;
//     try{
//         const user = await User.findOne({token:token});
//         const meetings = await Meeting.find({user_id : User.username});
//         res.json(meetings);
//     }
//     catch(e){
//       res.json({message:`something went wrong ${e}`});
//     }
// }

const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
      console.log('Querying meetings for user with token:', token);
      const user = await User.findOne({ token: token });
      console.log('User found:', user);
    //   const meetings = await Meeting.find({ user_id: user._id}).populate('user_id');
    const meetings = await Meeting.find(); 
      console.log('Meetings found:', meetings);
      const meetingsG = await Meeting.find();
      console.log("chatgpt :",meetingsG);
      res.json(meetings);
    } catch (e) {
      console.error('Error fetching user history:', e);
      res.json({ message: 'Error fetching user history' });
    }
  };

const addToHistory = async (req,res)=>{
    console.log("add to history called");
    const {token,meeting_code} = req.body; 
    try{
        const user = await User.findOne({token:token});
        const newMeeting = new Meeting({
            user_id : user._id,
            meetingCode : meeting_code 
        })
        await newMeeting.save();
        console.log("meeting saved");
        res.status(httpStatus.CREATED).json({message:"new meeting added:"}); 
    } catch(e){
        console.log(`something went wrong ${e}`);
    }
}

export {login ,register,getUserHistory,addToHistory};