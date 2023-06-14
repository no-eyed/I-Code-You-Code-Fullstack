import React, {useState, useRef, useEffect} from 'react'

const Chat = ({socketRef, roomId}) => {
    const [message, setMessage] = useState("");
    const [MessagesFromAll, setMessagesFromAll] = useState([]);

    //const messageRef = useRef(null);

    const handleInputMsg = (event) => {
      event.preventDefault();
      setMessage(event.target.value);
    }

    function handleMessageSending(event) {
      event.preventDefault();

      socketRef.current.emit("chatMessage", {roomId:roomId, message:message});
      setMessage('');
      console.log(MessagesFromAll);

      scrollfunc()
      //messageRef.current.value = "";
    }

    useEffect(() => {
      if(socketRef.current) {
        socketRef.current.on('Message', message => {
          //console.log(message);
          setMessagesFromAll(MessagesFromAll =>[...MessagesFromAll, message]);
        })
        console.log(MessagesFromAll);
        return () => {
          socketRef.current.off('Message');
        }
      }
    }, [socketRef.current]);


    const chatMessagesRef = useRef(null);

    const scrollfunc = () => {
      const chatMessages = chatMessagesRef.current;
      const scrollHeight = chatMessages.scrollHeight;
      const scrollTop = chatMessages.scrollTop;
      const clientHeight = chatMessages.clientHeight;
      const difference = scrollHeight - scrollTop - clientHeight;
    
      if (difference > 0) {
        const start = performance.now();
        const duration = 500;
    
        const step = (timestamp) => {
          const time = timestamp - start;
          const progress = Math.min(time / duration, 1);
          const distance = difference * progress;
          chatMessages.scrollBy(0, distance);
    
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
    
        requestAnimationFrame(step);
      }
    };

  return (
    <div className="chat-container">
        <div className="chat-header">
            <h4>Chats will appear here</h4>
            
        </div>
        <div className="chat-messages">
            {MessagesFromAll.map((message) => (
              <div className="Message">
                <p className="meta">
                  <span>{message.username}</span> <span>{message.time}</span>
                </p>
                <p className="text">{message.text}</p>
              </div>
            ))}
        </div>
        
        
        <div className="chat-form-container">
            <form className="chat-form">
                <input value = {message} className="message" type="text" placeholder="Enter Message"
                onChange={handleInputMsg} /> 
                <button className="Send" onClick={handleMessageSending}>Send</button>
            </form>
      </div>
    </div>
  )
}

export default Chat