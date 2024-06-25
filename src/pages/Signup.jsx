import React, { useEffect, useState,useRef } from 'react'

import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Modal} from 'bootstrap/dist/js/bootstrap.bundle'
export default function Login() {
      // let workingUrl = `https://webflix-ivory.vercel.app`
  let workingUrl = `http://localhost:8080`
    let modalRef = useRef()
    let navigate = useNavigate()
    let {register,handleSubmit,formState:{errors},watch}  = useForm();
    let [password,setPassword] = useState('aaa')
    let [flag,setFlag] = useState(false);
    let submit = async(data)=>{
    try {
        let result = await axios.post(`${workingUrl}/users/signup`,{...data,user_password:password},{withCredentials:true});
        if(result.status===201){
            let modalElement = modalRef.current;
                const bsModal = new Modal(modalElement);
                bsModal.show();
            navigate('/');
        }
    } catch (error) {
        console.log(error)
    }
    }
  return (
    <div>
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <h1 className='display-1 text-danger'>Welcome to Webflix</h1>
                </div>
                <div className="col-6">
                    <form className='formbox' onSubmit={handleSubmit(submit)}>
                        <input type="text" placeholder='Your name here' className='form-control my-2' {...register('user_name',{required:true})} />
                        {errors.user_name && <small className='text-danger'>Name is required</small>}


                        <input type="email" placeholder='Your email here' className='form-control my-2' {...register('user_email',{required:true})} />
                        {errors.user_email && <small className='text-danger'>email is required</small>}


                        <input onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder='make a password' className='form-control my-2' />
                       
                        <input type="text" placeholder='comfirm password' className='form-control my-2' onChange={(e)=>{
                            if(e.target.value==password){
                                setFlag(true)
                            }
                        }} />

                        {flag ? <small>password matched</small> : <small>password and confirm password do not matched</small>}

                        <div className="d-grid">
                        {
                            flag?  <button type='submit' className='btn btn-primary'>Signup here</button>
                             :  <button type='submit' className='btn btn-primary' disabled>Signup here</button>
                        }
                        </div>
                        <div className="d-grid">
                            <button className='btn btn-secondary my-2' onClick={()=>{navigate('/')}}>Already have an account ? login in..</button>
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
         Account created successfull <br/>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}
