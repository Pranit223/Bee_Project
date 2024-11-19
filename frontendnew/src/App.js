import { Routes,Route } from 'react-router-dom';
import './App.css';
import ChatsPage from './Pages/ChatsPage';
import Login from './Components/Login';

// import { Route } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
  return (
<>

  <Routes>
    {/* <Route path='/' Component={OptionPage}/> */}

    <Route path='/' Component={Login}/>
    <Route path='/chats' Component={ChatsPage}/>

    {/* <Route path='/login' Component={Login}/> */}
    {/* <Route path='/signup' Component={Signup}/> */}
  </Routes>
</>
  );
}

export default App;
