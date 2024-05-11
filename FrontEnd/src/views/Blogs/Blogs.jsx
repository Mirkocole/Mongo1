import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import { Container, Card, Button, Col, Row, Form, Modal, Spinner } from 'react-bootstrap'
import Post from '../../component/Post/Post';
import MainNavbar from '../../component/MainNavbar/MainNavbar';
import Sidebar from '../../component/Sidebar/Sidebar';

export default function Blogs() {


    // Reindirizzo alla login se non esiste l'user loggato nel context
    const { admin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!admin._id) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [admin])


    const apiBlogs = process.env.REACT_APP_URL_BLOGS;
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [image, setImage] = useState(new FormData());
    const [blogs, setBlogs] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState({
        category: '',
        title: '',
        cover: '',
        readTime: {
            value: '',
            unit: '',
        },
        author: admin._id,
        content: ''
    });

    const handleImage = (img) => {
        console.log(img)
        setImage((prev) => {
            prev.delete('cover');
            prev.append('cover', img);
            return prev
        });
    }

    const handleRefresh = () => setRefresh((prev) => prev = !prev);
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
        // console.log(article)
    }


    const imagePlaceholder = 'https://placehold.co/600x400';

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    async function getBlogs() {
        // console.log(apiBlogs)
        try {
            let res = await fetch(process.env.REACT_APP_URL_BLOGS, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (res.ok) {
                let json = await res.json();
                setBlogs(json);
                // console.log(blogs)
            }
        } catch (error) {

        }
    }

    async function createArticle() {

        try {
            setLoading(true);
            if (image.has('cover')) {
                // console.log('sono nel primo if con immagine')
                image.append('data', JSON.stringify(article));
                let res = await fetch(process.env.REACT_APP_URL_BLOGS, {
                    method: 'POST',
                    body: image
                });

                if (res.ok) {
                    image.delete('cover');
                    image.delete('data');
                    handleClose();
                    setLoading(false);
                    setRefresh(!refresh);
                }
            } else {

                let res = await fetch(process.env.REACT_APP_URL_BLOGS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(article)
                });

                if (res.ok) {
                    handleClose();
                    setLoading(false);
                    setRefresh(!refresh);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    }





    useEffect(() => {
        getBlogs();
    }, [refresh]);


    return (
        <>
            <Col xs={3} md={2} className='d-none d-md-flex flex-column shadow fixed-top' style={{ height: '100vh', maxWidth: '150px' }}>
                <Sidebar />
            </Col>
            <Col xs={12} md={8} >
                <MainNavbar />


                <Container className='p-4 rounded m-2 mx-auto'>

                    <h2 className='text-violet'>BLOGS</h2>
                    <Row className='align-items-center'>

                        <Col>
                            <Form className='my-3'>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Search Article" onChange={(e) => setSearch(e.target.value)} />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={3}>
                            <Button variant={'light'} className='btn btn-outline-info w-auto' onClick={handleShow}>Aggiungi Articolo</Button>
                        </Col>
                    </Row>


                    {/* Modale Aggiungi Blog */}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className='text-dark'>Aggiungi Articolo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='text-dark'>
                            <Form>
                                <Form.Group>
                                    <Form.Label className='text-dark'>Category</Form.Label>
                                    <Form.Control type="text" placeholder="inserisci la categoria" id='category' onChange={(e) => handleForm(e)} />
                                    <Form.Label className='text-dark'>Title</Form.Label>
                                    <Form.Control type="text" placeholder="inserisci il titolo" id='title' onChange={(e) => handleForm(e)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className='text-dark'>Cover</Form.Label>
                                    <Form.Control type="file" id='cover' onChange={(e) => { handleImage(e.target.files[0]) }} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className='text-dark'>Tempo di lettura</Form.Label>
                                    <Form.Control type="text" id='value' onChange={(e) => handleForm(e)} />
                                    <Form.Label className='text-dark'>Unità</Form.Label>
                                    <Form.Control type="text" id='unit' onChange={(e) => handleForm(e)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control as="textarea" rows={3} id='content' onChange={(e) => handleForm(e)} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Annulla
                            </Button>
                            <Button variant="primary" onClick={createArticle}>
                                Aggiungi
                            </Button>
                        </Modal.Footer>
                        {
                            loading && <Spinner animation="border" />
                        }
                    </Modal>


                    <Row xs={1} md={2} xxl={3} className=' d-flex justify-content-start g-4'>

                        {blogs && blogs.filter((el) => el.title.toLowerCase().includes(search.toLowerCase())).map((el, index) => {
                            return <Col key={index}>
                                <Post post={el} setRefresh={handleRefresh} handleClose={handleClose} />
                            </Col>
                        })}
                    </Row>
                </Container>
            </Col>
        </>
    )
}
