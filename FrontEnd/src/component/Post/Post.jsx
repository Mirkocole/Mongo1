import React, { useContext, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Button, Modal, Form, Row, Col, Badge,Spinner } from 'react-bootstrap'
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import Editor from 'react-simple-wysiwyg';
import '../Post/Post.css';
import { TbMessage } from "react-icons/tb";
import { AuthContext } from '../../context/AuthContextProvider';

export default function Post({ post, setRefresh, handleClose }) {
    const apiBlogs = process.env.REACT_APP_URL_BLOGS;
    const { _id, title, category, author, cover, readTime, content, comments } = post;
    const {admin} = useContext(AuthContext) ;

    const [image, setImage] = useState(new FormData());
    const imagePlaceholder = 'https://placehold.co/400x400';
    const [showEdit, setShowEdit] = useState(false);
    const [loading,setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [html, setHtml] = useState(content);
    const handleHtml = (e) => {
        setHtml(e.target.value);
        setArticle((prev) => prev = { ...prev, content: e.target.value })
    };
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const [article, setArticle] = useState({
        _id: _id,
        category: category,
        title: title,
        cover: cover,
        readTime: {
            value: readTime.value,
            unit: readTime.unit,
        },
        content: content
    });


    const handleImage = (img) => {

        setImage((prev) => {
            prev.delete('cover');
            prev.append('cover', img);
            return prev
        });
    }


    async function deleteArticle() {
        try {
            let res = await fetch(apiBlogs + _id, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                setRefresh();
                handleClose();
            }
        } catch (error) {

        }
    }

    async function editArticle(el) {



        try {
            if (image.has('cover')) {

                let res1 = await fetch(apiBlogs + el._id + '/cover', {
                    method: 'PATCH',
                    body: image
                });
                if (res1.ok) {
                    let res = await fetch(apiBlogs + el._id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(res1)
                    });

                    if (res.ok) {
                        image.delete('cover');
                        handleCloseEdit();
                        setRefresh((prev) => prev = !prev);
                    }
                }
            } else {

                let res = await fetch(apiBlogs + el._id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(el)
                });

                if (res.ok) {
                    handleCloseEdit();
                    setRefresh((prev) => prev = !prev);

                }
            }


        } catch (error) {
            console.log(error)
        }
    }

    const handleForm = (e) => {
        let key = e.target.id;
        let value = e.target.value;

        if (key === 'value' || key === 'unit') {


            if (key === 'value') {
                setArticle((prev) => {
                    prev = { ...prev, readTime: { value: value, unit: prev.readTime.unit } }
                    return prev;
                })
            } else {
                setArticle((prev) => {
                    prev = { ...prev, readTime: { unit: value, value: prev.readTime.value } }
                    return prev;
                })
            }

        } else if (key === 'name' || key === 'avatar') {



            if (key === 'name') {
                setArticle((prev) => {
                    prev = { ...prev, author: { name: value, avatar: prev.author.avatar } }
                    return prev;
                })
            } else {
                setArticle((prev) => {
                    prev = { ...prev, author: { avatar: value, name: prev.author.name } }
                    return prev;
                })
            }

        } else {

            setArticle((prev) => {
                prev = { ...prev, [key]: value }
                return prev;
            })
        }
    }

    return (
        <>
            <Card style={{ minWidth: '18rem', border: 'none' }} className='position-relative shadow cardPost'>
                {author._id === admin._id && <AiOutlineDelete className='mx-1 mt-2 btn btn-danger position-absolute top-0 fs-1 z-3 p-2 iconCard' onClick={() => { deleteArticle(_id) }} />}
                {author._id === admin._id && <BiEditAlt className='ms-5 mt-2 fs-1 position-absolute top-0 z-3 text-dark btn btn-warning p-2 iconCard' onClick={handleShowEdit} />}
                <Card.Img variant="top" src={`${cover && cover !== '' ? cover : imagePlaceholder}`} />
                <Card.Body>
                    <Card.Title className='text-center fs-2'><strong>{title}</strong></Card.Title>
                    <Card.Text dangerouslySetInnerHTML={{ __html: content }}></Card.Text>
                    <Row className='align-items-center'>
                        <Col><Card.Text style={{ fontSize: '14px', color: '#5e34c4' }}>Category: <strong>{category}</strong></Card.Text></Col>
                        <Col><Card.Text style={{ fontSize: '12px', color: 'orangered' }}>Read Time: <strong>{readTime.value} {readTime.unit}</strong></Card.Text></Col>
                    </Row>


                    <Row className='align-items-center  rounded  px-1 py-2 mt-4'>
                        <Col xs={2} md={3} xxl={3}><img alt='' src={author.avatar && author.avatar !== '' ? author.avatar : imagePlaceholder} className='rounded-circle' style={{ width: '60px', height: '60px', objectFit: 'cover' }} /></Col>
                        <Col><Card.Text><strong>{author.nome} {author.cognome}</strong></Card.Text></Col>

                    </Row>
                </Card.Body>

                <Card.Footer>
                    
                    <Button variant="outline-dark" onClick={()=> setShowComments(!showComments)}>
                    <TbMessage className='fs-3'/> <Badge pill bg="secondary">{comments.length}</Badge>
                        
                    </Button>

                    {showComments && <div className='my-2 p-1'>
                        <Button>Aggiungi commento</Button>
                        </div>
                    }

                    {
                        showComments && comments.map((el, index) => {
                            return <>
                            <div key={index} className='row border rounded my-2 p-1'>
                                <p>Author : {el.author}</p>
                                <h5>{el.content}</h5>
                            </div>
                            </>
                        })
                    }
                </Card.Footer>

            </Card>


            {/* Modale Modifica Articolo */}
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-dark'>Modifica Articolo</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-dark'>
                    <Form>
                        <Form.Group>
                            <Form.Label className='text-dark'>Category</Form.Label>
                            <Form.Control type="text" placeholder="inserisci la categoria" defaultValue={category} id='category' onChange={(e) => handleForm(e)} />
                            <Form.Label className='text-dark'>Title</Form.Label>
                            <Form.Control type="text" placeholder="inserisci il titolo" id='title' defaultValue={title} onChange={(e) => handleForm(e)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='text-dark'>Cover</Form.Label>
                            <Form.Control type="file" id='cover' onChange={(e) => handleImage(e.target.files[0])} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='text-dark'>Tempo di lettura</Form.Label>
                            <Form.Control type="text" id='value' onChange={(e) => handleForm(e)} defaultValue={readTime.value} />
                            <Form.Label className='text-dark'>Unità</Form.Label>
                            <Form.Control type="text" id='unit' onChange={(e) => handleForm(e)} defaultValue={readTime.unit} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='text-dark'>Autore</Form.Label>
                            <Form.Control type="text" id='name' onChange={(e) => handleForm(e)} defaultValue={author.name} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            {/* <Form.Control as="textarea" rows={3} id='content' onChange={(e) => handleForm(e)}  defaultValue={content}/> */}
                            <Editor id='content' onChange={(e) => handleHtml(e)} value={html} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={() => editArticle(article)}>
                        Modifica
                    </Button>
                </Modal.Footer>
                {
                    loading && <Spinner animation="border" />
                }
            </Modal>
        </>
    )
}
