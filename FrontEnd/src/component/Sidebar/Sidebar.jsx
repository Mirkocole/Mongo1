import React, { useContext, useEffect } from 'react'
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../logo2.png'
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContextProvider';

export default function Sidebar() {

    const [show, setShow] = useState(false);
    const { admin, setAdmin } = useContext(AuthContext)
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        setAdmin({});
        navigate('/')
    }
    return (
        <>
            <Navbar expand="lg" className=" sticky-top d-none d-md-flex flex-column justify-content-between" style={{ height: '100%' }}>
                <Container className='d-flex flex-column align-items-center justify-content-start'>
                    <Link className='nav-item nav-link text-dark m-3' to="/">
                        <img alt='logo' src={Logo} style={{ width: '80px' }} />
                    </Link>


                    <Nav className=" flex-column align-items-center mt-5">
                        <Link to="/" className='nav-item nav-link'>Home</Link>
                        <Link to="/blogs" className='nav-item nav-link'>Blogs</Link>
                        <Link to="/authors" className='nav-item nav-link'>Authors</Link>
                    </Nav>
                </Container>
                <Container className='d-flex flex-row align-items-center justify-content-evenly'>
                    <h6 className='text-dark'>{admin.nome} {admin.cognome}</h6>
                    <Dropdown drop='up'>
                        <Dropdown.Toggle  style={{backgroundColor: 'transparent', border : 'none'}}>
                            
                            <img alt='' src={admin.avatar} style={{ width: '55px', height: '55px', objectFit: 'contain' }} className='border rounded-circle' data-bs-toggle='dropdown' aria-expanded="false"></img>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item> <Link to={'/profile'} className=' nav-link'>Profile</Link></Dropdown.Item>
                            <Dropdown.Item onClick={ handleLogout}>LogOut</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Container>
            </Navbar>




        </>
    )
}
