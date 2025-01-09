
import { useState ,useEffect,useRef,useCallback} from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client'
function Chatbox() {
  const {sender,receiver} = useParams();
  console.log(sender,receiver);
  let workingUrl = (process.env.REACT_APP_API_URL || 'http://localhost:9090');
  let [data,setData] = useState([]);
  let [messageBody,setMessageBody] = useState('');
  const socketRef = useRef(null);

  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

let sendMessage = async()=>{
  if (socketRef.current) {
    socketRef.current.emit('pm', { body: messageBody, senderId: sender }, receiver);
    console.log('send message called');
     setMessageBody('');
     console.log(data);
  }
}

  let getmessages = useCallback(
    async()=>{
      try {
        console.log(sender,receiver)
      let results = await axios.get(`${workingUrl}/messages/${sender}/${receiver}`);
      console.log(results.data);
      setData(results.data)
      } catch (error) {
        console.log(error)
      }
    }
    ,[sender,receiver])

  useEffect(()=>{
    let socket = io('http://localhost:9090');
    socketRef.current = socket;
    socket.emit('register',sender);
  
    socket.on('pm',(msg)=>{
      console.log(msg);
      getmessages();
      })
    return () => {
      socket.disconnect();
    };
},[sender,getmessages])


useEffect(()=>{
  getmessages()
},[sender,receiver])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    
         <div className="container-fluid chatboxElement" >
            <div className='flexbox' id='messagebox'>
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

          {/* Invisible div to ensure scrolling */}
        <div ref={messagesEndRef} />

            </div>
            <div className='inputBox'>
              <textarea onChange={(e)=>{setMessageBody(e.target.value)}} value={messageBody} className='form-control' type="text" />
              <button onClick={sendMessage} className='btn btn-success'>Send</button>
            </div>
         </div>
    
  );
}

export default Chatbox;

