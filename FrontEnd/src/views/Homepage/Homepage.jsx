import React, { useContext, useEffect, useState } from 'react'
import '../Homepage/Homepage.css'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap/';
import Sidebar from '../../component/Sidebar/Sidebar';
import MainNavbar from '../../component/MainNavbar/MainNavbar';
import { AuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';


export default function Homepage() {

    const {admin, getAdmin} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(()=>{
        if (!admin._id) {
          if (!localStorage.getItem('token')) {
              
              localStorage.removeItem('token');
              navigate('/');
          } else {
              getAdmin(localStorage.getItem('token'));
          }
        }
    },[admin])

    return (
        <>
            <Col xs={3} md={2} className='d-none d-md-flex flex-column shadow fixed-top' style={{ height: '100vh', maxWidth: '150px' }}>
                <Sidebar />
            </Col>
            <Col xs={12} md={8} >
                <MainNavbar/>
                <h2>Homepage</h2>

            </Col>
        </>
    )
}
