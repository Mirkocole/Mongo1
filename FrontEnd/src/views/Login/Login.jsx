import React, { useContext, useEffect, useState } from 'react'
import { Container, Form, Button, Col, Alert, Spinner } from 'react-bootstrap'
import Logo from '../../../src/logo.png'
import { redirect, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import GoogleButton from 'react-google-button'

export default function Login() {

    const navigate = useNavigate();
    const { admin, setAdmin } = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [loading,setLoading] = useState(false);
    const [login,setLogin] = useState(false);

    useEffect(() => {

        if (localStorage.getItem('token')) {
            navigate('/home');
        }
    }, [admin])


    const [user, setUser] = useState({});


    const handleGoogleLogin = () => {
        window.open(process.env.REACT_APP_URL_AUTH + 'googleLogin', '_self');
    }

    const handleAdmin = (ele) => {
        let key = ele.id;
        let value = ele.value;
        setUser({ ...user, [key]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let login = await fetch(process.env.REACT_APP_URL_AUTH + 'login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (login) {
                setLoading(false);
                let res = await login.json();

                if (!res.user) {
                    setLoading(false);
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2000);
                }else{

                    console.log(res);
                    setAdmin(res.user);
                    localStorage.setItem('token', res.token);
                    
                    if (admin) {
                        console.log(admin)
                        navigate('/home')
                    }
                }

            } else {
                setLoading(false);
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2000);
            }


        } catch (error) {
            setLoading(false);
            setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2000);
        }
    }



    return (
        <>
            <Container fluid className='m-0 p-5 d-flex justify-content-center bg-dark' style={{ height: '100vh' }}>
                <Col xs="12" md="8" lg="6" xl="4" className='p-5 border d-flex flex-column rounded shadow align-items-center justify-content-between bg-light' style={{ maxHeight: '600px' }}>
                    <img src={Logo} style={{ height: '150px' }} className='' />
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" id='email' onChange={(el) => { handleAdmin(el.target) }} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" id='password' onChange={(el) => { handleAdmin(el.target) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Accetto le condizioni di privacy" />
                        </Form.Group>
                        <Button variant="dark" type="button" onClick={()=>navigate('/signup')}>
                            Registrati
                        </Button>
                        <Button type="submit" className='mx-2 bg-violet border border-none' onClick={(e) => handleLogin(e)}>
                            Accedi
                        </Button>
                        <Container className='my-3'>

                            <GoogleButton label='Accedi con Google' onClick={handleGoogleLogin} />
                            {loading && <Spinner animation="border" variant="secondary" />}
                        </Container>
                        {error && <Alert key='danger' variant='danger'>
                            C'è stato un errore nel login, riprova!
                        </Alert>}
                        {login && <Alert key='success' variant='success'>
                            Accesso effettutato!
                        </Alert>}
                        
                    </Form>
                </Col>
            </Container>
        </>
    )
}
