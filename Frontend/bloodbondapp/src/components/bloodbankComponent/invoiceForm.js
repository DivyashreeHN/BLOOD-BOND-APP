import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col ,Button} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import InvoiceContext from '../../contexts/invoiceContext';

export default function CreateInvoiceForm({ editInvoice, toggle }) {
    const { requestId } = useParams();
    const { invoices, invoiceDispatch } = useContext(InvoiceContext);
    const [form, setForm] = useState({
        lineItems: [{ description: '', units: '', price: '' }],
        date: ''
    });
    useEffect(() => {
        if (editInvoice) {
            setForm({
                lineItems: editInvoice.lineItems.map(item => ({
                    description: item.description,
                    units: item.units,
                    price: item.price
                })),
                date: new Date(editInvoice.date).toISOString().split('T')[0]
            });
        }
    }, [editInvoice]);

    const clearForm = () => {
        setForm({
            lineItems: [{ description: '', units: '', price: '' }],
            date: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleLineItemChange = (index, e) => {
        const { name, value } = e.target;
        const newLineItems = form.lineItems.map((item, i) => {
            if (i === index) {
                return { ...item, [name]: value };
            }
            return item;
        });
        setForm({
            ...form,
            lineItems: newLineItems
        });
    };

    const addLineItem = () => {
        setForm({
            ...form,
            lineItems: [...form.lineItems, { description: '', units: '', price: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editInvoice) {
                response = await axios.put(`http://localhost:3080/api/invoices/${editInvoice._id}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                });
                invoiceDispatch({ type: 'EDIT_INVOICE', payload: response.data });
            } else {
                response = await axios.post(`http://localhost:3080/api/invoices/${requestId}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                });
                invoiceDispatch({ type: 'ADD_INVOICES', payload: response.data });
            }
            invoiceDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
            clearForm();
            if (toggle) toggle();
            Swal.fire({
                title: 'Success!',
                text: 'Invoice created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (err) {
            console.log(err);
            invoiceDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
            Swal.fire({
                title: 'Error!',
                text: err.response?.data?.errors || 'An unexpected error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    return (
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="bg-danger text-dark">
                            <Card.Body>
                                <Card.Title className="fs-3">Create invoice</Card.Title>
                                <form onSubmit={handleSubmit}>
                                    {form.lineItems.map((item, index) => (
                                        <div key={index}>
                                            <h5>Line Item {index + 1}</h5>
                                            <div className='form-group'>
                                                <label className='form-label' htmlFor={`description${index}`}>Description</label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    id={`description${index}`}
                                                    className='form-control'
                                                    value={item.description}
                                                    onChange={(e) => handleLineItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label className='form-label' htmlFor={`units${index}`}>Units</label>
                                                <input
                                                    type="number"
                                                    name="units"
                                                    id={`units${index}`}
                                                    className='form-control'
                                                    value={item.units}
                                                    onChange={(e) => handleLineItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label className='form-label' htmlFor={`price${index}`}>Price</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    id={`price${index}`}
                                                    className='form-control'
                                                    value={item.price}
                                                    onChange={(e) => handleLineItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                     <Button className='btn btn-light' onClick={addLineItem}>
                                        Add Line Item
                                    </Button>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor='date'>Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            id='date'
                                            className='form-control'
                                            value={form.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <input type='submit' className='btn btn-dark' value='Create Invoice' />
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
            </Container>
        </div>
    );
}