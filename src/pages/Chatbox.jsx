
import { useState ,useEffect,useRef} from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client'
function Chatbox() {
  const {sender,receiver} = useParams()
  let baseurl = 'https://chatingapp.onrender.com'
  // let baseurl = 'http://localhost:9090'
  let [data,setData] = useState([]);
  let [messageBody,setMessageBody] = useState('');
  const socketRef = useRef(null);
let sendMessage = async()=>{
  if (socketRef.current) {
    socketRef.current.emit('pm', { body: messageBody, senderId: sender }, receiver);
    console.log('send message called');
  }
}

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
    let socket = io(baseurl);
    socketRef.current = socket;
    socket.emit('register',sender);
  
    socket.on('pm',(msg)=>{
      getmessages();
      })
    return () => {
      socket.disconnect();
    };
},[sender])


useEffect(()=>{
  getmessages()
},[sender,receiver])

  return (
    
         <div className="container-fluid chatboxElement" >
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
            <div className='inputBox'>
              <textarea onChange={(e)=>{setMessageBody(e.target.value)}} className='form-control' type="text" />
              <button onClick={sendMessage} className='btn btn-success'>Send</button>
            </div>
         </div>
    
  );
}

export default Chatbox;
