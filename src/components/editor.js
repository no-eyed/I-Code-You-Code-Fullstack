import React, {useEffect, useRef, socketRef} from 'react';
import Codemirror from 'codemirror';
import ACTIONS  from '../Actions';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const Editor = ({socketRef, roomId, onCodeChange}) => {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
           editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: {name: 'javascript', json: true},
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
           });
           
           editorRef.current.on('change', (instance, changes) => {
              console.log('changes', changes);
              const {origin} = changes;
              const code = instance.getValue();
              onCodeChange(code);
              if(origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                  roomId,
                  code,

                })
              }
              console.log(code);
           })

           

          //  editorRef.current.setValue('console.log');
        }

        init();
    }, []);

    useEffect(() => {
      if(socketRef.current) {
          socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
            console.log('Chal raha h', code);
            if(code !== null) {
                editorRef.current.setValue(code);
            }
         });
      }

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
      
    }, [socketRef.current]);
  return (
    <textarea id="realtimeEditor"></textarea>
  )
}

export default Editor