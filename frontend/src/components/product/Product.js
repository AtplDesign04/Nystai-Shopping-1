import React, { Fragment, useState, useEffect } from 'react';
import {  Button } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import ProductModal from './ProductModal';
import { addCartItemToCart } from '../../actions/cartActions'
import { addCartItem } from '../../slices/cartSlice';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

export default function Product({ product, col }) {
    const [showModal, setShowModal] = useState(false);
    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = (event) => {
        event.stopPropagation(); // Prevents the event from bubbling up to the card's onClick handler
        setShowModal(true);
    };
    const handleAddToCart = (event) => {
        event.stopPropagation(); // Prevents the event from bubbling up to the card's onClick handler
        if (quantity > product.stock) {
            toast.error('Quantity exceeds available stock');
            return;
        }
        if (user) {
            dispatch(addCartItemToCart(product._id, quantity));
        } else {
            const cartItem = {
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0].image,
                stock: product.stock,
                quantity
            };
            dispatch(addCartItem(cartItem));
            toast.success('Item added to cart successfully');
        }
    };


    // Find the main image URL in product images array
    const mainImage = product.images.find(image => image.mediaType === 'image');

    const openProductDetailPage = () => {
        window.open(`/products/${product._id}`, '_blank');
    };

    return (
        <Fragment>
            <div className={`col-sm-8 col-md-4 col-lg-${col} my-3`} onClick={openProductDetailPage} style={{ cursor: 'pointer' }}>
                <div className="card">
                    <div className="card-body d-flex flex-column">
                        <div className='text-center ' style={{ alignItems: 'center' }}>
                            {mainImage && (
                                mainImage.mediaType === 'image' ? (
                                    <img src={mainImage.url} alt={product.name} height="150" width="150" className='media-img' />
                                ) : (
                                    <video src={mainImage.url} alt={product.name} height="100" width="100" />
                                )
                            )}
                            <div className="list-group-item text-center quick-view">
                                <span onClick={handleModalShow} id="view_btn1">
                                    Quick View
                                </span>
                            </div>
                        </div>

                        <h5 className="card-title text-center mt-3" style={{ fontSize: '1rem' }}>
                            <b>{product.name}</b> 
                            
                        </h5>
                        <span className="pt-2 text-center" style={{fontSize:'0.9rem', color:'#4C4646'}}> {product._id}</span>
                        
                        <ul className="list-unstyled">
                            <li className="p-2">
                                <p className='text-center' style={{ fontSize: '0.9rem' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum </p>
                            </li>
                        </ul>
                        <div className='d-flex justify-content-between align-items-center'>
                            <p className="mb-0">₹{product.price}.00/-</p>
                            <Button type="button"
                                id="cart_btn1"
                                className="btn btn-primary"
                                disabled={product.stock === 0}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ProductModal show={showModal} handleClose={handleModalClose} product={product} />
        </Fragment>
    );
}
