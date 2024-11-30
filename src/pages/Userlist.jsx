import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
export default function Userlist({senderId}) {
    let workingUrl = process.env.REACT_APP_API_URL;
    const [users,setUsers] = useState([]);
    let getUsersData = async()=>{
        try {
          axios.defaults.withCredentials = true;
          let id = localStorage.getItem('id') || null
          let result =await axios.get(`${workingUrl}/users`,{withCredentials:true,headers:{
            authorization:`Bearer ${localStorage.getItem('jwt')}`
          }});
          console.log(result.data);
          setUsers(result.data);
          console.log(result.data?.user_profile) 
        } catch (error) {
          console.log(error)  
        }
      }

      useEffect(function(){
        getUsersData()
      },[]);
    
  return (
    <div>
        {
            users.map((user)=>{
              if(senderId!=user._id){
                return(
                  <Link to={`room/${senderId}/${user._id}`} className='nav-link'>
                  <div role='button' className='d-flex justify-content-between align-items-center p-2 bg-light m-2' style={{height:"100px"}}>
                       <div className='text-center' style={{flex:"1"}}>
                          <b>{user.user_name}</b> <br/>
                          <i>{user.user_email}</i>
                       </div>
                       <div style={{width:'80px'}}>
                          {
                              user.user_profile
                              ?<img style={{aspectRatio:"1/1",objectFit:"cover",width:"80%"}} src={`${workingUrl}/users/getimage/${user.user_profile}`} className='img-fluid rounded-circle' alt="" />
                              :<img src='placeholder.png' className='img-fluid rounded-circle'    alt=''/>
                          }
                       </div>
                  </div>
                 </Link>
                )
              }
            })
        }
    </div>
  )
}
