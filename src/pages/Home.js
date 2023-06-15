import React, {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// import logoL from '../assets/Onesan.png';
// import logoD from '../assets/OnesanDark.png';
import logoL from '../assets/DudeLight.png';
import logoD from '../assets/DudeDark.png';

const Home = () => {

    const navigate = useNavigate();
  
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');

    const[theme, setTheme] = useState('dark');
    const[logo, setLogo] = useState(logoL);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const toggleLogo = () => setLogo(logo === logoD ? logoL: logoD);

    const toggle = () => {
      toggleTheme();
      toggleLogo();
    };

    useEffect(() => {
      document.body.className = `${theme}-theme`;
  }, [theme]);
  
    const createNewRoom = (e) =>{
      e.preventDefault();
  
      const id = uuidv4();
      // console.log(id);
  
      setRoomId(id);
  
      toast.success('Created a new Room Id');
      
    };
  
    const joinRoom = () =>{
      if(!roomId || !username){
        toast.error("RoomId and username are required you loser");
      }
      else{
      navigate(`/editor/${roomId}`,{
        state: {
          username,
          
        }
      })
  
      }
    }
  

    const handleInputEnter = (e) => {
        console.log('event', e.code);
        if(e.code === 'Enter') {
            joinRoom();
        }
    }
    return (
        <div className="HomePageWrapper">
            <div className="imageWrapper">
              <img className="formImage" src={logo} alt=" Image Unavailable!"></img>
            </div>
            <div className="formWrapper">
                <h4 className="mainLabel">Login from Here</h4>
                <div className="inputGroup">
                    <input type="text" className="inputBox" onChange={(e) => setUserName(e.target.value)} value={username} placeholder='Write your Username Here'></input>

                    <input type="text" className="inputBox" onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}
                    placeholder='Wrtie Room Id here'></input>

                    <button className="ButtOn" onClick={joinRoom}>Join Room</button>

                    <span className="createInfo">If you do not have a Room Id  you can create your own,
                    Or get a random one using  <a onClick={createNewRoom} href="" className="createNewBtn">Create New RoomId</a></span>

                </div>
            </div>

            <div className="themeWrapper">
              <button className="themeButton" onClick={toggle}>Change Theme</button>
            </div>
            
            <footer>
                <h4>Built with StandoSkai</h4>
            </footer>
        </div>
    );
};

export default Home
