import React, { useContext, useEffect, useState } from 'react'
import '../Homepage/Homepage.css'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap/';
import Sidebar from '../../component/Sidebar/Sidebar';
import MainNavbar from '../../component/MainNavbar/MainNavbar';
import { AuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';


export default function Homepage() {

    const { admin, getAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!admin._id) {
            if (!localStorage.getItem('token')) {

                localStorage.removeItem('token');
                navigate('/');
            } else {
                getAdmin(localStorage.getItem('token'));
            }
        }
    }, [admin])

    return (
        <>
            <Col xs={3} md={2} className='d-none d-md-flex flex-column shadow fixed-top' style={{ height: '100vh', maxWidth: '150px' }}>
                <Sidebar />
            </Col>
            <Col xs={12} md={10} className='px-lg-3 px-2'>
                <MainNavbar />
                <h2 className='text-center my-5'>Striveblog</h2>
                <p className='text-center'>Sei pronto a condividere le tue idee, ispirazioni e storie con il mondo? <br></br>StriveBlog ti offre la libertà di esprimerti attraverso articoli coinvolgenti e originali.</p>
                <h3 className='text-center my-5'>Cosa Puoi Fare su StriveBlog?</h3>
                <Container fluid className='d-flex justify-content-center p-0 m-0'>
                    <Row xs={1} md={3} lg={4} className='g-3 gap-0 justify-content-center'>
                        <Col className='p-3 border m-3 rounded d-flex flex-column align-items-center justify-content-center'>
                            <h6 className='text-center'>Pubblicare Articoli Coinvolgenti</h6>
                            
                        </Col>
                        <Col className='p-3 border m-3 rounded d-flex flex-column align-items-center justify-content-center'>
                            <h6 className='text-center'>Esplora Contenuti Creativi</h6>
                            
                        </Col>
                        <Col className='p-3 border m-3 rounded d-flex flex-column align-items-center justify-content-center'>
                            <h6 className='text-center'>Collegati con Altri Appassionati</h6>
                            
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <Row xs={1} md={3} className='g-2 justify-content-center'>
                        <Col className=' d-flex flex-column align-items-center'>
                            <Button variant='dark'><Link to="/authors" className='nav-link'>Visualizza gli autori</Link></Button>
                        </Col>
                        <Col className=' d-flex flex-column align-items-center'>
                            <Button className='bg-violet' style={{borderColor : '#5e34c4'}}><Link to="/blogs" className='nav-link'>Visualizza gli articoli</Link></Button>
                        </Col>
                    </Row>
                </Container>

            </Col>
        </>
    )
}
