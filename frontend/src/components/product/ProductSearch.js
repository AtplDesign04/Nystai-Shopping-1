import { Fragment, useEffect, useState, useRef } from "react";
import MetaData from "../layouts/MetaData";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from "../product/Product";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaCamera, FaHome, FaBell, FaVideo, FaEllipsisH } from 'react-icons/fa';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import "./ProductDetail.css";

export default function ProductSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 2000]);
    const [priceChanged, setPriceChanged] = useState(price);
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [rating, setRating] = useState(null);
    const { keyword, category } = useParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const priceDropdownRef = useRef(null); // New ref for price dropdown
    const categoryList = [
        { name: 'NVR', icon: <FaVideo /> },
        { name: 'SMART HOME', icon: <FaHome /> },
        { name: 'SENSORS', icon: <FaBell /> },
        { name: 'CAMERA', icon: <FaCamera /> },
        { name: 'OTHERS', icon: <FaEllipsisH /> }
    ];

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            return toast.error(error);
        }

        const subcategoryParams = activeSubcategory && activeSubcategory !== 'All' ? `subcategory=${activeSubcategory}` : '';

        dispatch(getProducts(keyword, priceChanged, category, subcategoryParams, rating, currentPage));
    }, [error, dispatch, currentPage, keyword, category, activeSubcategory, priceChanged, rating]);

    const handleSubCategoryClick = (selectedSubCategory) => {
        setActiveSubcategory(selectedSubCategory);
    };

    const handlePriceApply = () => {
        setPriceChanged(price);
    };

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
        setActiveSubcategory('All'); // Reset subcategory to 'All' when main category is clicked
    };

    const handlePriceChange = (newPrice) => {
        setPrice(newPrice);
    };

    const handleRadioChange = (priceRange) => {
        const [min, max] = priceRange.split('-').map(val => parseInt(val, 10));
        setPrice([min, max]);
        setPriceChanged([min, max]);
    };

    const handleClearRatingFilter = () => {
        setPrice([1, 2000]);
        setPriceChanged([1, 2000]);
        setRating(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
            if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) { // Close price dropdown on click outside
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Results'} />
                    <div className="container">
                        <div className="container-fluid">
                            <div className="category-section tab-slider">
                                {categoryList.map((cat) => (
                                    <div
                                        key={cat.name}
                                        className={`category-icon category-item ${category === cat.name ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(cat.name)}
                                    >
                                        <div className="icon">{cat.icon}</div>
                                        <div>{cat.name}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="row">
                                <div className="container">
                                    <div className="subcategory-section">
                                        <div className="subcategory-items">
                                            
                                        </div>

                                        <div className="subcategory-dropdown">
                                            
                                        </div>

                                        <div className="filter-section d-flex" ref={priceDropdownRef}>
                                            <div className="filter-item">
                                                <div className="filter-title" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                                    <span>Filter</span>
                                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                                </div>
                                                <div className={`filter-content ${isFilterOpen ? 'show' : 'hide'}`}>
                                                    <div className="filter-sub-item slider p-3">
                                                        <div className="filter-sub-title">
                                                            Price
                                                        </div>
                                                        <Slider
                                                            range={true}
                                                            marks={{
                                                                1: '₹1',
                                                                2000: '₹2000'
                                                            }}
                                                            min={1}
                                                            max={2000}
                                                            defaultValue={price}
                                                            onChange={handlePriceChange}
                                                            handleRender={renderProps => {
                                                                return (
                                                                    <Tooltip overlay={`₹${renderProps.props['aria-valuenow']}`}>
                                                                        <div {...renderProps.props}></div>
                                                                    </Tooltip>
                                                                );
                                                            }}
                                                        />
                                                        <button
                                                            className="btn btn-primary m-3"
                                                            onClick={handlePriceApply}
                                                        >
                                                            GO
                                                        </button>
                                                    </div>

                                                    <div className="filter-sub-item radio">
                                                        <div className="filter-sub-title">
                                                            Price
                                                        </div>
                                                        <div>
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name="price"
                                                                    value="500-1000"
                                                                    checked={price[0] === 500 && price[1] === 1000}
                                                                    onChange={() => handleRadioChange("500-1000")}
                                                                />
                                                                ₹500 - ₹1000
                                                            </label>
                                                            <br />
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name="price"
                                                                    value="1000-1500"
                                                                    checked={price[0] === 1000 && price[1] === 1500}
                                                                    onChange={() => handleRadioChange("1000-1500")}
                                                                />
                                                                ₹1000 - ₹1500
                                                            </label>
                                                            <br />
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name="price"
                                                                    value="1500-2000"
                                                                    checked={price[0] === 1500 && price[1] === 2000}
                                                                    onChange={() => handleRadioChange("1500-2000")}
                                                                />
                                                                ₹1500+
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="filter-sub-item">
                                                        <div className="filter-sub-title">
                                                            Rating
                                                        </div>
                                                        <div className="d-flex">
                                                            {[5, 4, 3, 2, 1].map(star => (
                                                                <button
                                                                    key={star}
                                                                    className={`btn btn-light ${rating === star ? 'active' : ''}`}
                                                                    onClick={() => setRating(star)}
                                                                >
                                                                    {star} <FontAwesomeIcon icon={faStar} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <button
                                                            className="btn btn-secondary mt-3"
                                                            onClick={handleClearRatingFilter}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <section className="row">
                                        {products && products.length > 0 ? (
                                            products.map((product) => (
                                                <Product key={product._id} product={product} col={3} />
                                            ))
                                        ) : (
                                            <p className="mt-5">There are no products with this keyword.</p>
                                        )}
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>

                    {resPerPage <= productsCount && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            }
        </Fragment>
    );
}
