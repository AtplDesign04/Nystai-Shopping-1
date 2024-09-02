import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { Modal } from 'react-bootstrap';
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem, removeCartItem, updateCartItemQuantity } from "../../slices/cartSlice";
import { clearError, clearProduct, clearReviewSubmitted } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './ProductDetail.css'
export default function ProductDetail() {
    const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => state.productState);
    const { user } = useSelector((state) => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [mainMedia, setMainMedia] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (product.images && product.images.length > 0) {
            setMainMedia(product.images[0]);
        }
    }, [product.images]);

    const increaseQty = () => {
        const count = document.querySelector(".count");
        if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    };

    const decreaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber === 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const reviewHandler = () => {
        const formData = new FormData();
        formData.append("rating", rating);
        formData.append("comment", comment);
        formData.append("productId", id);
        dispatch(createReview(formData));
    };

    const handleAddToCart = () => {
        if (quantity > product.stock) {
            toast.error("Quantity exceeds available stock");
            return;
        }
        if (user) {
            dispatch(addCartItemToCart(product._id, quantity));
        } else {
            const cartItem = {
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0].url,
                stock: product.stock,
                quantity
            };
            dispatch(addCartItem(cartItem));
            toast.success("Item added to cart successfully");
        }
    };

    useEffect(() => {
        if (isReviewSubmitted) {
            handleClose();
            toast("Review Submitted successfully", {
                type: "success",
                onOpen: () => dispatch(clearReviewSubmitted())
            });
        }

        if (error) {
            toast(error, {
                type: "error",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        if (!product._id || isReviewSubmitted) {
            dispatch(getProduct(id));
        }
    }, [dispatch, id, isReviewSubmitted, error]);

    useEffect(() => {
        return () => {
            dispatch(clearProduct());
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={product.name} />
                    <div className="row flex-column flex-lg-row justify-content-around detail">
                        <div className="additional-images-container">
                            {product.images && product.images.length > 0 && product.images.map((media, index) => (
                                <div className="additional-image" key={media._id} onMouseEnter={() => setMainMedia(media)}>
                                    {media.mediaType === 'image' ? (
                                        <img src={media.url} alt={product.title} height="100" width="100" />
                                    ) : (
                                        <video className="additional-image" src={media.url} height="100" width="100" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="col-5 col-lg-5 img-fluid main-image-container" id="product_image">
                            {mainMedia && (
                                mainMedia.mediaType === 'image' ? (
                                    <img
                                        className="main-media"
                                        src={mainMedia.url}
                                        alt={product.title}
                                        height="500"
                                        width="500"
                                    />
                                ) : (
                                    <video
                                        className="main-media"
                                        src={mainMedia.url}
                                        alt={product.title}
                                        height="400"
                                        width="400"
                                        autoPlay
                                        loop
                                    />
                                )
                            )}
                        </div>
                        <div className="main-image-container1" id="product_image">
                            {mainMedia && (
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    }}
                                    pagination={{ clickable: true }}
                                >
                                    {product.images.map((media) => (
                                        <SwiperSlide key={media._id}>
                                            {media.mediaType === 'image' ? (
                                                <img
                                                    className="main-media"
                                                    src={media.url}
                                                    alt={product.title}
                                                    height="500"
                                                    width="500"
                                                />
                                            ) : (
                                                <video
                                                    className="main-media"
                                                    src={media.url}
                                                    alt={product.title}
                                                    height="500"
                                                    width="500"
                                                    autoPlay
                                                    loop
                                                />
                                            )}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>
                        <div className="col-12 col-lg-5 mt-5 product-info">

                            <h3>{product.name}</h3>
                            <p id="product_id">Product #{product._id}</p>
                            <hr className="line-tag" />
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                            <hr className="line-tag" />
                            <p id="product_price">₹{product.price}/-</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn- minus" onClick={decreaseQty}>-</span>
                                <input type="number" className="form-control count d-inline" value={quantity} readOnly style={{ background: 'transparent' }} />
                                <span className="btn btn- plus" onClick={increaseQty}>+</span>
                            </div>
                            <button
                                type="button"
                                id="cart_btn"
                                className="btn btn-primary d-inline ml-4"
                                disabled={product.stock === 0}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                            <p className={product.stock > 10 ? 'greenColor' : 'redColor'}>Available Stock : {product.stock}</p>
                            <hr className="line-tag" />
                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                            {user ?
                                <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                    Submit Your Review
                                </button> :
                                <div className="alert alert-danger mt-5" style={{width:'50%'}}> Login to Post Review</div>
                            }
                        </div>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Post Your valuable Reviews</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ul className="stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <li
                                        value={star}
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`star ${star <= rating ? 'orange' : ''}`}
                                        onMouseOver={(e) => e.target.classList.add('yellow')}
                                        onMouseOut={(e) => e.target.classList.remove('yellow')}
                                    >
                                        <i className="fa fa-star"></i>
                                    </li>
                                ))}
                            </ul>

                            <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3"></textarea>
                            <button disabled={loading} onClick={reviewHandler} aria-label="Close" className="my-3 float-right review-btn px-4 text-dark">Submit</button>
                        </Modal.Body>
                    </Modal>
                    <div className="product-details">
                        <div className="tab-slider">
                            <div className={isMobile ? "nav-tabs-container mobile" : "nav-tabs-container"}>
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
                                            role="tab" aria-controls="home" aria-selected="true">Description</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button"
                                            role="tab" aria-controls="profile" aria-selected="false">Technical Details</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button"
                                            role="tab" aria-controls="contact" aria-selected="false">Logistical Information</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button"
                                            role="tab" aria-controls="reviews" aria-selected="false">Reviews</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="tab-content prod-dec" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <p>{product.description}</p>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div className="table-responsive">
                                    <table className="table ">
                                        <tbody>
                                            {product.brand && (
                                                <tr>
                                                    <th>Brand</th>
                                                    <td>{product.brand}</td>
                                                </tr>
                                            )}
                                            {product.itemModelNum && (
                                                <tr>
                                                    <th>Item Model Number</th>
                                                    <td>{product.itemModelNum}</td>
                                                </tr>
                                            )}
                                            {product.serialNum && (
                                                <tr>
                                                    <th>Serial Number</th>
                                                    <td>{product.serialNum}</td>
                                                </tr>
                                            )}
                                            {product.connectionType && (
                                                <tr>
                                                    <th>Connection Type</th>
                                                    <td>{product.connectionType}</td>
                                                </tr>
                                            )}
                                            {product.hardwarePlatform && (
                                                <tr>
                                                    <th>Hardware Platform</th>
                                                    <td>{product.hardwarePlatform}</td>
                                                </tr>
                                            )}
                                            {product.os && (
                                                <tr>
                                                    <th>Operating System</th>
                                                    <td>{product.os}</td>
                                                </tr>
                                            )}
                                            {product.powerConception && (
                                                <tr>
                                                    <th>Power Conception</th>
                                                    <td>{product.powerConception}</td>
                                                </tr>
                                            )}
                                            {product.batteries && (
                                                <tr>
                                                    <th>Batteries</th>
                                                    <td>{product.batteries}</td>
                                                </tr>
                                            )}
                                            {product.packageDimension && (
                                                <tr>
                                                    <th>Package Dimension</th>
                                                    <td>{product.packageDimension}</td>
                                                </tr>
                                            )}
                                            {product.portDescription && (
                                                <tr>
                                                    <th>Port Description</th>
                                                    <td>{product.portDescription}</td>
                                                </tr>
                                            )}
                                            {product.connectivityType && (
                                                <tr>
                                                    <th>Connectivity Type</th>
                                                    <td>{product.connectivityType}</td>
                                                </tr>
                                            )}
                                            {product.compatibleDevices && (
                                                <tr>
                                                    <th>Compatible Devices</th>
                                                    <td>{product.compatibleDevices}</td>
                                                </tr>
                                            )}
                                            {product.powerSource && (
                                                <tr>
                                                    <th>Power Source</th>
                                                    <td>{product.powerSource}</td>
                                                </tr>
                                            )}
                                            {product.specialFeatures && (
                                                <tr>
                                                    <th>Special Features</th>
                                                    <td>{product.specialFeatures}</td>
                                                </tr>
                                            )}
                                            {product.includedInThePackage && (
                                                <tr>
                                                    <th>Included In The Package</th>
                                                    <td>{product.includedInThePackage}</td>
                                                </tr>
                                            )}
                                            {product.manufacturer && (
                                                <tr>
                                                    <th>Manufacturer</th>
                                                    <td>{product.manufacturer}</td>
                                                </tr>
                                            )}
                                            {product.itemSize && (
                                                <tr>
                                                    <th>Item Size</th>
                                                    <td>{product.itemSize}</td>
                                                </tr>
                                            )}
                                            {product.itemWidth && (
                                                <tr>
                                                    <th>Item Width</th>
                                                    <td>{product.itemWidth}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                {/* Add logistical information content here */}
                            </div>
                            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                                {product.reviews && product.reviews.length > 0 && <ProductReview reviews={product.reviews} />}
                            </div>
                        </div>
                    </div>

                </Fragment>
            }
        </Fragment>
    );
}


