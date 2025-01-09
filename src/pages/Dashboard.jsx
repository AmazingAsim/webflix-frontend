import axios from 'axios';
import React from 'react'
import { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {Modal} from 'bootstrap/dist/js/bootstrap.bundle'
import { Outlet } from 'react-router-dom';
import Userlist from './Userlist';
export default function Dashboard() {
  let modalRef = useRef();
  let profileRef = useRef();
  let navigate = useNavigate()
  let [user,setUser] = useState({})
  let [imageUrl,setImageUrl] = useState('placeholder.png')
  let [file,setFile] = useState(null)
  const workingUrl = (process.env.REACT_APP_API_URL || 'http://localhost:9090');
 let getUserData = async()=>{
    try {
      axios.defaults.withCredentials = true;
      let id = localStorage.getItem('id') || null
      let result =await axios.get(`${workingUrl}/users/getUserById/${id}`,{withCredentials:true,headers:{
        authorization:`Bearer ${localStorage.getItem('jwt')}`
      }});
      console.log(result.data);
      setUser(result.data);
      setImageUrl(`${workingUrl}/users/getimage/${result.data?.user_profile}`)
      
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(()=>{
    let jwt = localStorage.getItem('jwt') || null;
    if(!jwt){
      navigate('/');
    }
    else{
      getUserData();
    }
  },[navigate]);

  let logout =  ()=>{
    let modalElement = modalRef.current;
    const bsModal = new Modal(modalElement);
    bsModal.show();
  }

  // handle file change function here


  let handleFileChange = (event)=>{
      setFile(event.target.files[0]);
      let modalElement = profileRef.current;
    const bsModal = new Modal(modalElement);
    bsModal.show();
  }

  let uploadProfile = async()=>{
      const formData = new FormData();
      formData.append('profileImage',file);
      formData.append('_id',user._id);
      try {
        let result = await axios.post(`${workingUrl}/users/addProfile`,formData,{headers:{
          'Content-Type':"multipart/form-data"
        }})
        console.log(result.data);
        if(result?.data?.flag){
          getUserData()
        }
      } catch (error) {
        console.log(error)
      }
  }
  
  return (
    <div className='bg-success'>
      <div className="container-fluid">
          <div className="row bg-light"  style={{height:'102vh'}}>
             <aside className="col-sm-3 text-center" style={{background:'#eee'}}>
              <div id="s1" className='mt-2'>
         
          <label htmlFor="profile" id='imagelabel'>
            <img src={imageUrl} alt='user' role='button' id='profileImage'  className='w-25 img-fluid rounded-circle border'/>
            <button className="hoverbutton" style={{width:'50px'}}>edit</button>
          </label>
          <input type="file" id='profile'  onChange={handleFileChange} hidden/>

          <p> <i>{user?.user_name}</i></p>
          </div>


               <div id="s2">
                 <Userlist senderId={user._id} />
               </div>

               
              <div id="s3" className='d-grid p-2'>
                <button className="btn btn-danger" onClick={logout} >Log out</button>
              </div>
             </aside>


             <main className="col-sm-9 p-0 ">
               <nav className='m-0 p-3' style={{background:'#eee'}}>.</nav>
               <Outlet></Outlet>
             </main>
          </div>
      </div>









      {/* modal here */}.

      <div ref={modalRef} className="modal" id="loginmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
         <p> You will be logged out of this account </p>
        <button className='btn btn-danger mx-2' data-bs-dismiss="modal" onClick={()=>{
          localStorage.clear();
          let modalElement = modalRef.current;
          const bsModal = new Modal(modalElement);
          bsModal.hide();
          navigate('/');
        }} >Yes</button>

        <button type="button" className="btn btn-secondary mx-2" data-bs-dismiss="modal">cancel</button>
      </div>
    </div>
  </div>
</div>

 {/* modal for profile picture change  */}
 
 <div ref={profileRef} className="modal" id="profile_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
           <p>Change My Profile Picture</p>
          <button data-bs-dismiss="modal" className='btn btn-primary mx-2' onClick={uploadProfile}>Yes</button>
          <button data-bs-dismiss="modal" className='btn btn-dark mx-2' >cancel</button>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}
