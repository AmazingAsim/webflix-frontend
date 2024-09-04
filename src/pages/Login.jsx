import React, { useEffect } from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {Modal} from 'bootstrap/dist/js/bootstrap.bundle'
export default function Login() {
  let workingUrl = `https://chatingapp.onrender.com`
  // let workingUrl = `http://localhost:9090`
    let modalRef = useRef()
    let navigate = useNavigate();
    let {register,handleSubmit,formState:{errors}}  = useForm();
    let submit = async (data)=>{
        try {
            axios.defaults.withCredentials = true;
            let result =await axios.post(`${workingUrl}/users/login`,data,{withCredentials:true});
            if(result.status==201){
                localStorage.setItem('jwt',result?.data?.jwt);
                localStorage.setItem('email',result?.data?.email);
                localStorage.setItem('id',result?.data?.id)
                let modalElement = modalRef.current;
                const bsModal = new Modal(modalElement);
                bsModal.show();
                navigate('dashboard');
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
      let jwt = localStorage.getItem('jwt') || null;
      if(jwt){
        navigate('dashboard');
      }
    },[navigate]);


    
  return (
    <div>
        <div className="container">
            <div className="row my-5">
                <div className="col-6">
                    <h1 className='display-1 text-danger'>Welcome to Webflix</h1>
                </div>
                <div className="col-6">
                    <form className='formbox' onSubmit={handleSubmit(submit)} >
                        <input type="text" className='form-control my-3' placeholder='Your Email here' {...register('user_email',{required:true})} />
                        {errors.user_name && <small className='text-danger'>email is required</small>}

                        <input type="text" className='form-control my-3' placeholder='Your password here' {...register('user_password',{required:true})} />
                        {errors.user_password && <small className='text-danger'>password is required</small>}
                        <div className="d-grid">
                         <button type='submit' className='btn btn-primary my-1'>Login here</button>
                        </div>
                        <div className="d-grid">
                         <button className='btn btn-secondary my-1' onClick={()=>{navigate('signup')}}>Create a new Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


        {/* modal here */}
        <div ref={modalRef} className="modal fade" id="loginmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
        Login successfull <br/>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}
