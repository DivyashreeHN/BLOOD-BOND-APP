import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import axios from 'axios';
import InvoiceContext from "../../contexts/invoiceContext";

export default function ViewInvoice() {
    const { requestId, responderId } = useParams();
    const { invoices, invoiceDispatch } = useContext(InvoiceContext);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            invoiceDispatch({type:'CLEAR_INVOICE',payload:[]})
            try {
                const response = await axios.get(`http://localhost:3080/api/invoice/${requestId}/${responderId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                invoiceDispatch({ type: 'SET_INVOICE', payload: response.data });
                invoiceDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
            } catch (err) {
                invoiceDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response?.data?.errors });
            }
        })();
    }, [requestId, responderId, invoiceDispatch]);

    const handlePayNow = async(invoice) => {
        try{
            const body={
                invoiceId:invoice._id,
                request:invoice.request._id,
                bloodBank:invoice.bloodBank._id,
                user:invoice.user,
                amount:invoice.amount
            }
            const response = await axios.post('http://localhost:3080/api/create-checkout-session',body,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            localStorage.setItem('stripeId', response.data.id)
            window.location = response.data.url; 
        }catch(err){

        }
    };

    return (
        <div>
            {Array.isArray(invoices?.invoiceData) && invoices.invoiceData.length > 0 ? (
                <div>
                    {invoices.invoiceData.map((invoice) => (
                        <Card key={invoice._id} style={{ width: '18rem', margin: 'auto', marginTop: '20px' }}>
                            <Card.Body>
                                <Card.Title>Invoice Details</Card.Title>
                                <Card.Text>
                                    <strong>Blood Bank Name:</strong> {invoice.bloodBank.name}<br />
                                    <strong>Contact No:</strong> {invoice.bloodBank.phoneNumber}<br />
                                    <strong>Amount:</strong> rupees {invoice.amount}
                                    <p>Dear user, please make payment of rupees {invoice.amount} to reserve the {invoice.request.blood?.bloodType} of {invoice.request.blood?.bloodGroup} before {new Date(invoice.date).toLocaleDateString()} 2:00 PM</p>
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                {invoice.lineItems.map(item => (
                                    <ListGroupItem key={item._id}>
                                        <strong>Description:</strong> {item.description}<br />
                                        <strong>Units:</strong> {item.units}<br />
                                        <strong>Price:</strong> rupees {item.price}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                            <Card.Body>
                                <Button onClick={() => handlePayNow(invoice)}>Pay Now</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <div>No invoice data available</div>
            )}
        </div>
    );
}
