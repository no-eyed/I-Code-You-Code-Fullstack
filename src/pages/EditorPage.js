import React, {useState, useRef, useEffect} from 'react'
import { initSocket } from '../socket';
import toast from "react-hot-toast";
import ACTIONS  from '../utils/Actions';
import Client from '../components/Client';
import Editor from "../components/Editor"
import Chat from '../components/Chat';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';
import logoLight from '../assets/LogoLight.png';
import logoDark from '../assets/LogoDark.png';

const EditorPage = () => {

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const {roomId} = useParams();

    const [clients, setClients] = useState([
    ]);

    const[theme, setTheme] = useState('light');
    const[logo, setLogo] = useState(logoDark);
    
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const toggleLogo = () => setLogo(logo === logoDark ? logoLight: logoDark);
    const toggle = () => {
        toggleTheme();
        toggleLogo();
    }

    useEffect(() => {
        document.body.className = `${theme}-theme`;
    }, [theme]);

    useEffect (() =>{

        const init = async() => {

            socketRef.current = await initSocket();
            socketRef.current.on('connect_error',(err) => handleErrors(err));
            socketRef.current.on('connect_failed',(err) => handleErrors(err));

            function handleErrors(e){
                console.log("Socket error", e);
                toast.error("Socket connection failed, try again later");
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username: location.state?.username,
                
            });

            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
                if(username !== location.state?.username) {
                    toast.success(`${username} has joined the room`);             
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {code: codeRef.current, socketId});
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
                toast.success(`${username} has left the room`);

                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId);
                })
            })
        };

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('RoomId has been copied to clipboard');
        } catch(err) {

        }
    }


    function leaveRoom() {
        reactNavigator('/');
    }

    if(!location.state) {
        return <Navigate to="/"/>
    }

  return (
    <div className='mainWrap' >
        <div className="bodyWrap">
        <div className="aside">
            <div className="asideInner">
                <div className="logo">
                    <img className="logoImage" src={logo} alt="Logo"/>
                </div>
                 <h3 className="connect">Connected</h3>
                <div className="clientsList">

                    {
                        clients.map((client) => (
                        <Client key = {client.socketId} username = {client.username}/>
                        
                    ))}
                </div>
            </div>
        </div>
            <div className="editorWrap">
                <Editor socketRef = {socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code}}/>
            </div>
                
            <div className="chatWrap"> 
                <Chat socketRef = {socketRef} roomId={roomId} uName={location.state?.username}/>
            </div>
        </div>
            <div className='buttons'>
                <button className="Themebtn" onClick={toggle}>Change Theme</button>
                <button className="Copybtn" onClick={copyRoomId}>Copy Room ID</button>
                <button className="Leavebtn" onClick={leaveRoom}>Leave Room</button>
            </div>      
    </div>
  );
};


export default EditorPage
