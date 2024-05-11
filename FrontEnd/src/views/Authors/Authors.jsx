import React, { useEffect, useState } from 'react'
import '../Homepage/Homepage.css'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap/';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContextProvider';
import Author from '../../component/Author/Author';
import Sidebar from '../../component/Sidebar/Sidebar';
import MainNavbar from '../../component/MainNavbar/MainNavbar';

export default function Authors() {
 

// Reindirizzo alla login se non esiste l'user loggato nel context
  const {admin} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
      if (!admin._id) {
          localStorage.removeItem('token');
          navigate('/');
      }
  },[admin])



  const apiUrl = process.env.REACT_APP_URL_AUTHORS;
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [valueForm, setValueForm] = useState({
      nome: '',
      cognome: '',
      email: '',
      data_di_nascita: '',
      avatar: ''
  });
 

  

  const handleForm = (e) => setValueForm((prev) => prev = { ...prev, [e.target.id]: e.target.value });
  

  const [authors, setAuthors] = useState([]);
  const [image,setImage] = useState(new FormData());

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImage = (img) => {
      console.log(img)
      setImage((prev) =>{
          prev.delete('avatar');
          prev.append('avatar', img);
          return prev
      });
  }

  async function getAuthors() {
      try {
          let res = await fetch(apiUrl,{
            headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')}
          });
          if (res.ok) {

              let json = await res.json();
              setAuthors(json);
              // console.log(json);
          }
      } catch (error) {

      }
  }


  async function createAuthors() {
      try {
          
          if (image.has('avatar')) {
                image.delete('data');
              image.append('data',JSON.stringify(valueForm))
              let res = await fetch(process.env.REACT_APP_URL_AUTHORS, {
                  method: 'POST',
                  headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                  body: image
              });
              if (res.ok) {
                  let json = await res.json();
                  }
                  setRefresh((prev) => prev = !prev);
                  handleClose();
              
          } else {
              
              let res = await fetch(process.env.REACT_APP_URL_AUTHORS, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(valueForm)
              });
              console.log(JSON.stringify(valueForm));
              setRefresh((prev) => prev = !prev);
              handleClose();
          }
      } catch (error) {
          console.log(error)
      }
  }

 

 

  useEffect(() => {
      getAuthors();

  }, [refresh])

  return (
      <>
      <Col xs={3} md={2} className='d-none d-md-flex flex-column shadow fixed-top' style={{height: '100vh', maxWidth : '150px'}}>
      <Sidebar />
    </Col>
    <Col xs={12} md={8} >
        
        <MainNavbar />
          <Container fluid className='container-trasparent text-dark my-5 p-5 rounded'>
              <h1 className='text-violet'>AUTHORS</h1>
              <Row className='align-items-center'>

                  <Col>
                      <Form className='my-3'>
                          <Form.Group>
                              <Form.Control type="text" placeholder="Search Author" onChange={(e) => setSearch(e.target.value)} />
                          </Form.Group>
                      </Form>
                  </Col>
                  <Col xs={3}>
                      <Button variant={'light'} className='btn btn-outline-dark w-auto' onClick={handleShow}>Aggiungi Autore</Button>
                  </Col>
              </Row>


              {/* Modale Aggiungi Autore */}
              <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                      <Modal.Title className='text-dark'>Aggiungi Autore</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='text-dark'>
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
                              <Form.Label className='text-dark'>Data di Nascita</Form.Label>
                              <Form.Control type="date" id='data_di_nascita' onChange={(e) => handleForm(e)} />
                          </Form.Group>
                          <Form.Group>
                              <Form.Label className='text-dark'>Avatar</Form.Label>
                              <Form.Control type="file" id='avatar' onChange={(e) => handleImage(e.target.files[0])} />
                          </Form.Group>
                      </Form>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                          Annulla
                      </Button>
                      <Button variant="primary" onClick={createAuthors}>
                          Aggiungi
                      </Button>
                  </Modal.Footer>
              </Modal>

              

              <Row xs={1} md={2} lg={2} xl={3} xxl={4} className='g-3 gap-0'>
                  {
                      authors && authors.filter((el) => el.nome.toLowerCase().includes(search.toLowerCase())).map((el, index) => {
                          return <Col key={index} className='position-relative'>
                              <Author author={el} setRefresh = {setRefresh}/>
                          </Col>
                      })
                  }
              </Row>
          </Container>
    </Col>
      </>
  )
}
