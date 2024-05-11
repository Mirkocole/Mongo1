import React, { useEffect, useState } from 'react'
import Sidebar from '../../component/Sidebar/Sidebar'
import MainNavbar from '../../component/MainNavbar/MainNavbar'
import { Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextProvider'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const {search} = useLocation()
    const params = new URLSearchParams(search);
    const navigate = useNavigate();
    const [loggedIn,setLoggedIn] = useState(false);

    const {admin,setAdmin,getAdmin} = useContext(AuthContext);
    
    

    useEffect(()=>{
        
        if (params.has('accessToken')) {
            getAdmin(params.get('accessToken'));
            localStorage.setItem('token',params.get('accessToken'));
            
        }
        console.log(admin)
        
    },[])



  return (
    <>
            <Col xs={3} md={2} className='d-none d-md-flex flex-column shadow fixed-top' style={{ height: '100vh', maxWidth: '150px' }}>
                <Sidebar />
            </Col>
            <Col xs={12} md={8} >
                <MainNavbar/>
                <h2>Profile</h2>

            </Col>
        </>
  )
}
