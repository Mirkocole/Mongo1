import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Col, Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './views/Homepage/Homepage';
import MainNavbar from './component/MainNavbar/MainNavbar';
import Blogs from './views/Blogs/Blogs';
import Sidebar from './component/Sidebar/Sidebar';
import Authors from './views/Authors/Authors';
import Login from './views/Login/Login';
import AuthContextProvider from './context/AuthContextProvider';
import Profile from './views/Profile/Profile';


function App() {
  return (
    <AuthContextProvider>

      <Container fluid className='d-flex m-0 p-0 justify-content-center'>
        <BrowserRouter>
          {/* <MainNavbar /> */}
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Homepage />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/authors' element={<Authors />} />
            <Route path='/profile' element={<Profile />} />

          </Routes>


          <Routes>

          </Routes>
        </BrowserRouter>
      </Container>
    </AuthContextProvider>
  );
}

export default App;
