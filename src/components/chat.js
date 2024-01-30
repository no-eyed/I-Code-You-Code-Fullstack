import React, {useState, useRef, useEffect} from 'react'
import Message from './Message';

export const Chat = ({socketRef, roomId, uName}) => {
    const [message, setMessage] = useState('');
    const [Id, setId] = useState(0);
    const [MessagesFromAll, setMessagesFromAll] = useState([]);

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

    const handleInputMsg = (event) => {
      event.preventDefault();
      setMessage(event.target.value);
    }

    function handleMessageSending(event) {
      event.preventDefault();

      console.log(uName);
      if (message.trim() !== ''){
      socketRef.current.emit("chatMessage", { roomId:roomId, message:message});
      setMessage('');
      setId(Id + 1);
      }

      scrollfunc();
      //messageRef.current.value = "";
    }

    useEffect(() => {
      if(socketRef.current) {
        socketRef.current.on('Message', message => {
          setMessagesFromAll(MessagesFromAll =>[...MessagesFromAll, message]);
        })
        return () => {
          socketRef.current.off('Message');
        }
      }
    }, [socketRef.current]);

  return (
    <div className="chat-container">
        <div className="chat-header">
            <h4>Chats will appear here</h4>
        </div>
        <div className="chat-messages" ref={chatMessagesRef}>
            {MessagesFromAll.map((message) => (
              <Message key={message.id} userName={message.username === uName ? `You`: message.username} Time={message.time} Text={message.text} isUserMessage={message.username === uName}
            />
            ))}
        </div>
        
        <div className="chat-form-container">
            <form className="chat-form">
                <input value = {message} className="message" type="text" placeholder="Enter Message" required onChange={handleInputMsg} /> 
                <button className="Send" onClick={handleMessageSending}>Send</button>
            </form>
      </div>
    </div>
  )
}

export default Chat