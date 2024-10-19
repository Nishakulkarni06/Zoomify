import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:3000/api/v1/users"
})


export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    // const getHistoryOfUser = async () => {
    //     try {
    //         let request = await client.get("/get_all_activity", {
    //             params: {
    //                 token: localStorage.getItem("token")
    //             }
    //         });
    //         console.log(request.data);
    //         return request.data;
    //     } catch
    //      (err) {
    //         throw err;
    //     }
    // }

    // const getHistoryOfUser = async () => {
    //     try {
    //         const token =  localStorage.getItem("token");  // Fetch token from localStorage
    //         console.log("Token:", token);  // Log token to check if it's valid
    
    //         if (!token) {
    //             throw new Error("Token is missing. User might not be logged in.");
    //         }
    
    //         let request = await client.get("/get_all_activity", {
    //             params: { token: token }  // Use the token in the request
    //         });
    
    //         console.log("Response Data:", request.data);  // Log the response from the server
    //         return request.data;  // Return the history data
    //     } catch (err) {
    //         console.error("Error fetching user history:", err.message);  // Log the specific error
    //         throw err;
    //     }
    // };

    // const getHistoryOfUser = async () => {
    //     try {
    //       const token = localStorage.getItem("token");
    //       if (!token) {
    //         throw new Error("Token is missing. User might not be logged in.");
    //       }
      
    //       let request = await client.get("/get_all_activity", {
    //         params: { token: token }
    //       });
      
    //       console.log("Response Data:", request.data);
    //       return request.data;
    //     } catch (err) {
    //       console.error("Error fetching user history:", err.message);
    //       throw err;
    //     }
    //   };

    const getHistoryOfUser = async () => {
        try {
            const token = getToken(); // Fetch token from localStorage
            console.log("Token:", token); // Log token to check if it's valid
    
            if (!token) {
                throw new Error("Token is missing. User might not be logged in.");
            }
    
            let request = await client.get("/get_all_activity", {
                params: { token: token } // Use the token in the request
            });
    
            console.log("Response Data:", request.data); // Log the response from the server
            return request.data; // Return the history data
        } catch (err) {
            console.error("Error fetching user history:", err.message); // Log the specific error
            throw err;
        }
    };

      const getToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing. User might not be logged in.");
        }
        return token;
      };
      
    //   const getHistoryOfUser = async () => {
    //     try {
    //       const token = getToken();
    //       let request = await client.get("/get_all_activity", {
    //         params: { token: token }
    //       });
      
    //       console.log("Response Data:", request.data);
    //       return request.data;
    //     } catch (err) {
    //       console.error("Error fetching user history:", err.message);
    //       throw err;
    //     }
    //   };

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}



