
import { useState ,useEffect} from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client'
function Chatbox() {
  const {sender,receiver} = useParams()
  // let baseurl = 'https://chatingapp.onrender.com'
  let baseurl = 'http://localhost:9090'
  let [data,setData] = useState([])
  let socket = io(baseurl);
  
//   socket.on('server',(msg)=>{
//     console.log(msg);
//     setData([...data,msg])
//     })

  let getmessages = async()=>{
    try {
      console.log(sender,receiver)
    let results = await axios.get(baseurl+`/messages/${sender}/${receiver}`);
    console.log(results.data);
    setData(results.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getmessages()
},[sender,receiver])

  return (
    <div className="App">
         <div className="container">
            <div className='flexbox'>
          {
            data.map(message=>{
              if(sender==message.sender._id){
                  return(
                    <div className='sender d-flex justify-content-between align-items-center'>
                    <p >{message.messageBody}</p>
                    <p>
                      {new Date(message.timestamp)
                      .toLocaleTimeString('en-IN',{ hour: '2-digit', minute: '2-digit' })}
                      </p>
                  </div>
                  )
              }
              else{
                return(
                  <div  className=' receiver d-flex justify-content-between align-items-center'>
                <p>{message.messageBody}</p>
                <p>
                    {new Date(message.timestamp)
                    .toLocaleTimeString('en-IN',{ hour: '2-digit', minute: '2-digit' })}
                    </p>
              </div>
                )
              }
            })
          }
            </div>
            <div className='inputBox'></div>
         </div>
    </div>
  );
}

export default Chatbox;
