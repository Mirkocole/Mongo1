import React, { useContext, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { Button, Modal, Form } from 'react-bootstrap'
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from 'react';
import '../Author/Author.css'
import { AuthContext } from '../../context/AuthContextProvider';

export default function Author(props) {

    
    const apiUrl = process.env.REACT_APP_URL_AUTHORS;
    const { _id, nome, cognome, email, data_di_nascita, avatar } = props.author;
    const {admin} = useContext(AuthContext);

    const imagePlaceholder = 'https://placehold.co/600x400';
    const [valueFormEdit, setValueFormEdit] = useState({
        nome: '',
        cognome: '',
        email: '',
        data_di_nascita: '',
        avatar: ''
    });
    const handleFormEdit = (e) => setValueFormEdit((prev) => prev = { ...prev, [e.target.id]: e.target.value });
    const [image, setImage] = useState(new FormData());
    const [showEdit, setShowEdit] = useState(false);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const handleImage = (img) => {
        
        setImage((prev) => {
            prev.delete('avatar');
            prev.append('avatar', img);
            return prev
        });
    }

        const modalEditAuthor = (el) => {
            setValueFormEdit(el);
            handleShowEdit();
        }

        async function deleteAuthors(id) {
            try {
                let res = await fetch(apiUrl + id, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application,json' }
                });

                props.setRefresh((prev) => prev = !prev);
                // console.log(json);

            } catch (error) {

            }
        }

        async function editAuthor(el) {

            try {
                

                if (image.has('avatar')) {
                    let res1 = await fetch(apiUrl + el._id + '/avatar', {
                        method: 'PATCH',
                        headers: {'Authorization' : 'Bearer '+localStorage.getItem('token')},
                        body: image
                    });
                    if (res1.ok) {

                        let res = await fetch(apiUrl + el._id, {
                            method: 'PUT',
                            headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                            body: JSON.stringify(res1)
                        });

                        if (res.ok) {
                            image.delete('avatar');
                            image.delete('data');
                            handleCloseEdit();
                            props.setRefresh((prev) => prev = !prev);

                        }
                    }
                } else {

                    let res = await fetch(apiUrl + el._id, {
                        method: 'PUT',
                        headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                        body: JSON.stringify(el)
                    });

                    if (res.ok) {
                        handleCloseEdit();
                        props.setRefresh((prev) => prev = !prev);

                    }
                }


            } catch (error) {
                console.log(error)
            }
        }

        return (
            <>
                <Card style={{ maxWidth: '18rem',minWidth : '200px' }} className='cardPost'>
                    {_id === admin._id && <AiOutlineDelete className='m-2 btn btn-danger position-absolute top-0 fs-2 z-3 p-2 iconCard' onClick={() => { deleteAuthors(_id) }} />}
                    {_id === admin._id && <BiEditAlt className='ms-5 mt-2 fs-2 position-absolute top-0 z-3 text-dark btn btn-warning p-2 iconCard' onClick={() => { modalEditAuthor(props.author) }} />}
                    <Card.Img variant="top" src={avatar ? avatar : imagePlaceholder} />
                    <Card.Body >
                        <Card.Title>{nome} {cognome}</Card.Title>
                        <Card.Text className='text-dark'>{email}</Card.Text>
                        <Card.Text className='text-dark'>{data_di_nascita}</Card.Text>
                    </Card.Body>
                </Card>


                {/* Modale Modifica Autore */}
                <Modal show={showEdit} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-dark'>Modifica Autore</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-dark'>
                        <Form>
                            <Form.Group>
                                <Form.Label className='text-dark'>Nome</Form.Label>
                                <Form.Control type="text" placeholder="inserisci il nome" id='nome' defaultValue={valueFormEdit.nome} onChange={(e) => handleFormEdit(e)} />
                                <Form.Label className='text-dark'>Cognome</Form.Label>
                                <Form.Control type="text" placeholder="inserisci il cognome" id='cognome' defaultValue={valueFormEdit.cognome} onChange={(e) => handleFormEdit(e)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-dark'>Email</Form.Label>
                                <Form.Control type="email" placeholder="inserisci l'email" id='email' defaultValue={valueFormEdit.email} onChange={(e) => handleFormEdit(e)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-dark'>Data di Nascita</Form.Label>
                                <Form.Control type="date" id='data_di_nascita' defaultValue={valueFormEdit.data_di_nascita} onChange={(e) => handleFormEdit(e)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-dark'>Avatar</Form.Label>
                                <Form.Control type="file" id='avatar' onChange={(e) => handleImage(e.target.files[0])} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEdit}>
                            Annulla
                        </Button>
                        <Button variant="primary" onClick={() => { editAuthor(valueFormEdit) }}>
                            Aggiorna
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
