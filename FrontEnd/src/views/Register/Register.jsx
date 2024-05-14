import React from 'react'
import { Modal, Button, Form,Container, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../../../src/logo.png'

export default function Register() {

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [valueForm, setValueForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    data_di_nascita: '',
    avatar: ''
  });

  


  const handleForm = (e) => setValueForm((prev) => prev = { ...prev, [e.target.id]: e.target.value });

  async function createAuthors() {
    try {

      

        let res = await fetch(process.env.REACT_APP_URL_AUTH+'register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(valueForm)
        });
        if(res.ok){
          let json = await res.json();
          console.log(json);
        }
      
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>



      <Container fluid className='m-0 p-5 d-flex justify-content-center bg-dark' style={{ height: '100vh' }}>
        <Col xs="12" md="8" lg="6" xl="4" className='p-5 border d-flex flex-column rounded shadow align-items-center justify-content-between bg-light' style={{ maxHeight: '800px' }}>
          <img src={Logo} style={{ height: '150px' }} className='' />
          <Form>
            <Form.Group>
              <Form.Label className='text-dark'>Nome</Form.Label>
              <Form.Control type="text" placeholder="inserisci il nome" id='nome' onChange={(e) => handleForm(e)} />
              <Form.Label className='text-dark'>Cognome</Form.Label>
              <Form.Control type="text" placeholder="inserisci il cognome" id='cognome' onChange={(e) => handleForm(e)} />
            </Form.Group>
            <Form.Group>
              <Form.Label className='text-dark'>Email</Form.Label>
              <Form.Control type="email" placeholder="inserisci l'email" id='email' onChange={(e) => handleForm(e)} />
            </Form.Group>
            <Form.Group>
              <Form.Label className='text-dark'>Password</Form.Label>
              <Form.Control type="password"  id='password' onChange={(e) => handleForm(e)} />
            </Form.Group>
            <Form.Group>
              <Form.Label className='text-dark'>Data di Nascita</Form.Label>
              <Form.Control type="date" id='data_di_nascita' onChange={(e) => handleForm(e)} />
            </Form.Group>
            <Button variant="dark" type="button" onClick={createAuthors} className='my-2'>
              Registrati
            </Button>
          </Form>
        </Col>
      </Container>
    </>
  )
}
