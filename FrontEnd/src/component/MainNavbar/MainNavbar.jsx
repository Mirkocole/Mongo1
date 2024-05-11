import React from 'react'
import { Navbar, Container, Offcanvas, Button, Nav, NavDropdown, InputGroup } from 'react-bootstrap';
import Logo from '../../logo2.png';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { CiSearch } from "react-icons/ci";

export default function MainNavbar() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid className='d-flex justify-content-between align-items-center'>
                    <Button onClick={handleShow} className='d-flex d-md-none bg-transparent m-3' style={{ border: 'none' }}>
                        <img alt='logo' src={Logo} style={{ width: '80px' }} />
                    </Button>
                    <Form>
                        <Form.Group className='d-flex align-items-center'>

                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1" className='text-light bg-violet'><CiSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search"
                                    aria-label="Search"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Container>
            </Navbar>

            {/* Sidebar Mobile */}
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='d-flex flex-column justify-content-between'>
                    <Nav className=" flex-column align-items-start mt-5">
                        <Link to="/" className='btn-outline-dark nav-item nav-link'>Home</Link>
                        <Link to="/blogs" className='nav-item nav-link'>Blogs</Link>
                        <Link to="/authors" className='nav-item nav-link'>Authors</Link>
                    </Nav>
                    <Container className='d-flex align-items-center justify-content-evenly'>
                        <h6 className='text-dark'>Mirko Colella</h6>
                        <NavDropdown>
                            <NavDropdown.Item>
                                <img alt='' src={Logo} style={{ width: '55px', height: '55px', objectFit: 'contain' }} className='border rounded-circle' />
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <img alt='' src={Logo} style={{ width: '55px', height: '55px', objectFit: 'contain' }} className='border rounded-circle' />
                            </NavDropdown.Item>

                        </NavDropdown>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
