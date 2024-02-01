import './styles/App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import EditorPage from './pages/EditorPage';
import HomePage from './pages/HomePage';
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <>
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: ''
            }
          }
        }}
      ></Toaster>
    </div>


    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<HomePage/>}> </Route>
        <Route path ='/editor/:roomId' element={<EditorPage/>}> </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
