import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../layouts/Loader';
import { orderDetail as orderDetailAction } from '../../actions/orderActions';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import lod from '../../images/logo.png';
import './OrderDetail.css'; // Ensure to create and link a CSS file for custom styles

export default function OrderDetail() {
    const { orderDetail, loading } = useSelector(state => state.orderState);
    const { shippingInfo = {}, billingInfo = {}, user = {}, orderStatus = "Processing", orderItems = [], totalPrice = 0, paymentInfo = {} } = orderDetail;
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    const dispatch = useDispatch();
    const { id } = useParams();
    const [generatePdf, setGeneratePdf] = useState(false);

    const handleGeneratePdf = () => {
        setGeneratePdf(true);
    };

    useEffect(() => {
        dispatch(orderDetailAction(id));
    }, [id, dispatch]);

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        heading: {
            fontSize: 20,
            marginBottom: 10,
        },
        subheading: {
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 5,
        },
        greenColor: {
            color: 'green',
        },
        redColor: {
            color: 'red',
        },
        tableContainer: {
            marginTop: 10,
            border: '1px solid #000',
        },
        tableRow: {
            flexDirection: 'row',
            borderBottom: '1px solid #000',
            padding: 5,
        },
        tableCell: {
            width: '35%',
            padding: 3,
            fontSize: 10,
        },
        image: {
            height: '50',
            width: '50',
            marginHorizontal: '45%',
        }
    });

    const OrderDetailPDF = ({ orderDetail }) => (
        <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Image src={lod} style={styles.image} />
                    <Text style={styles.heading}>Order #{orderDetail._id}</Text>

                    <Text style={styles.subheading}>Shipping Info</Text>
                    <Text>Name: {orderDetail.user.name}</Text>
                    <Text>Phone: {orderDetail.shippingInfo.phoneNo}</Text>
                    <Text>Address: {orderDetail.shippingInfo.address}, {orderDetail.shippingInfo.city}, {orderDetail.shippingInfo.postalCode}, {orderDetail.shippingInfo.state}, {orderDetail.shippingInfo.country}</Text>
                    <Text style={styles.subheading}>Billing Info</Text>
                    <Text>Name: {orderDetail.user.name}</Text>
                    <Text>Phone: {orderDetail.billingInfo.phoneNo}</Text>
                    <Text>Address: {orderDetail.billingInfo.address}, {orderDetail.billingInfo.city}, {orderDetail.billingInfo.postalCode}, {orderDetail.billingInfo.state}, {orderDetail.billingInfo.country}</Text>
                    <Text>Amount: RS.{orderDetail.totalPrice}</Text>

                    <Text style={styles.subheading}>Payment</Text>
                    <Text style={orderDetail.paymentInfo && orderDetail.paymentInfo.status === 'succeeded' ? styles.greenColor : styles.redColor}>
                        {orderDetail.paymentInfo && orderDetail.paymentInfo.status === 'succeeded' ? 'PAID' : 'NOT PAID'}
                    </Text>

                    <Text style={styles.subheading}>Order Status</Text>
                    <Text style={orderDetail.orderStatus && orderDetail.orderStatus.includes('Delivered') ? styles.greenColor : styles.redColor}>
                        {orderDetail.orderStatus}
                    </Text>

                    <Text style={styles.subheading}>Order Items</Text>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>ID</Text>
                            <Text style={styles.tableCell}>HSN</Text>
                            <Text style={styles.tableCell}>Name</Text>
                            <Text style={styles.tableCell}>Price</Text>
                            <Text style={styles.tableCell}>Quantity</Text>
                        </View>
                        {orderDetail.orderItems && orderDetail.orderItems.map(item => (
                            <View key={item._id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{item.product}</Text>
                                <Text style={styles.tableCell}>202456</Text>
                                <Text style={styles.tableCell}>{item.name}</Text>
                                <Text style={styles.tableCell}>RS.{item.price}</Text>
                                <Text style={styles.tableCell}>{item.quantity} Piece(s)</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <div className="row d-flex justify-content-between order-detail-container">
                        <div className="col-10 col-lg-8 mt-5 order-details">
                            <h1 className="my-5 orderid">Order #{orderDetail._id}</h1>
                            {loading ? (
                                <Loader />
                            ) : generatePdf ? (
                                <PDFDownloadLink
                                    document={<OrderDetailPDF orderDetail={orderDetail} />}
                                    fileName={`${orderDetail._id}.pdf`}
                                    className="btn btn-primary generate-pdf-btn"
                                >
                                    {({ blob, url, loading, error }) => (loading ? 'Loading...' : 'Download Invoice')}
                                </PDFDownloadLink>
                            ) : (
                                <button onClick={handleGeneratePdf} className="btn btn-success generate-pdf-btn">Generate Invoice</button>
                            )}
                            <div className="order-info">
                                <h4 className="mb-4">Shipping Info</h4>
                                <p><b>Name:</b> {user.name}</p>
                                <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                                <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                            </div>
                            <div className="order-info">
                                <h4 className="mb-4">Billing Info</h4>
                                <p><b>Name:</b> {user.name}</p>
                                <p><b>Phone:</b> {billingInfo.phoneNo}</p>
                                <p className="mb-4"><b>Address:</b>{billingInfo.address}, {billingInfo.city}, {billingInfo.postalCode}, {billingInfo.state}, {billingInfo.country}</p>
                            </div>
                            <p><b>Amount:</b> ₹{totalPrice}</p>

                            <hr />
                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? 'text-success' : 'text-danger'}><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>
                            <hr />
                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus && orderStatus.includes('Delivered') ? 'text-success' : 'text-danger'}><b>{orderStatus}</b></p>
                            <hr/>
                            <h4 className="my-4">Order Items:</h4>
                           
                            <div className="order-items">
                                {orderItems && orderItems.map(item => (
                                    <div className="row my-5 order-item" key={item._id}>
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} className="order-item-img" />
                                        </div>
                                        <div className="col-5 col-lg-5">
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </div>
                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>₹{item.price}</p>
                                        </div>
                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                           
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    );
}
