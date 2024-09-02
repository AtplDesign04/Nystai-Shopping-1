import { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaHome, FaBell, FaVideo, FaEllipsisH } from 'react-icons/fa'; // Example icons from Font Awesome
import "./product/ProductDetail.css";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 2000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [categories, setCategories] = useState([]);

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

    dispatch(getProducts(null, null, null, null, null, currentPage))
  }, [error, dispatch, currentPage, categories, priceChanged]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <Fragment>
      {/* <Slideshow/> */}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />

          <section id="products" className="container">
            <div className="mb-4 category-section tab-slider">
              {categoryList.map((cat) => (
                <div
                  key={cat.name}
                  className="category-icon"
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="icon">{cat.icon}</div>
                  <div>{cat.name}</div>
                </div>
              ))}
            </div>

            <div className="row">
              {products &&
                products.map((product) => (
                  <Product col={3} key={product._id} product={product} />
                ))}
            </div>
          </section>

          {productsCount > 0 && productsCount > resPerPage ? (
            <div className="d-flex justify-content-center mt-5 tab-slider">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={"page-item"}
                linkClass={"page-link"}
              />
            </div>
          ) : null}
        </Fragment>
      )}
     
      
    
    
    </Fragment>
  );
}

