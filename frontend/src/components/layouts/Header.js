import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Search from "./Search";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import { getCartItemsFromCart } from "../../actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const { items } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [showMobileInput, setShowMobileInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (keyword.trim() !== "") {
        navigate(`/search/${keyword}`);
    }
}, [keyword, navigate]);

const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") {
        toast.error("Please enter a keyword");
        return;
    }
    // navigate(`/search/${keyword}`);
};

useEffect(() => {
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowMobileInput(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
        setKeyword("");
    }
}, [location]);

const logoutHandler = () => {
  dispatch(logout);
  return navigate("/login");
};

  useEffect(() => {
    dispatch(getCartItemsFromCart());
  }, [dispatch]);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <div className="container-fluid">
      <nav className="navbar row">
        <div className="col-lg-3 col-md-4 col-sm-5 col-6">
          <div className=" ">
            <Link to="/">
              <img width="120px" className="main-logo mt-2" src="/images/logo.png" alt="img" />
            </Link>
            <Link to="/">
              <img width="60px" className="main-logo-mobile mt-4" src="/images/mobile-logo-triangle.png" alt="img" />
            </Link>
          </div>
        </div>

        <div className="col-lg-6 col-md-5 col-sm-7 col-6 mt-2 mt-md-0">
          <form onSubmit={searchHandler}>
            <div className="input-group search-container" ref={inputRef}>
              <input
                type="text"
                id="search_field"
                className="form-control desktop-search"
                placeholder="&#xf002;     Search Nystai Products"
                onChange={(e) => { setKeyword(e.target.value) }}
                value={keyword}
                style={{ textAlign: 'left' }}
              />

              


            </div>

          </form>
        </div>

        <div className="col-lg-3 col-md-3 col-sm-12 text-left justify-content-center mt-1 mt-md-0 d-flex">
        <div className="search-icon-container mt-2 text-right" onClick={() => setShowMobileInput(!showMobileInput)}>
                <i className="fa fa-search search-icon" aria-hidden="true"></i>
              </div>
          {isAuthenticated ? (
            <Dropdown className="d-inline text-dark">
              <Dropdown.Toggle variant="default text-white" id="dropdown-basic" className="text-dark dropdown">
                <figure className="avatar avatar-nav">
                  <Image src={user?.avatar ?? "./images/default_avatar.png"} />
                </figure>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user?.role === "admin" && (
                  <Dropdown.Item onClick={() => navigate("./admin/dashboard")} className="text-dark">
                    DashBoard
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => navigate("./myprofile")} className="text-dark">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("./orders")} className="text-dark">
                  My Orders
                </Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler} className="text-danger">
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown className="d-inline text-dark">
              <Dropdown.Toggle variant="default text-white" id="dropdown-basic" className="text-dark dropdown">
                <figure className="avatar avatar-nav">
                  <Image width="10px" src={user?.avatar ?? "./images/default_avatar.png"} />
                </figure>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("./login")} className="text-dark">
                  Log in
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("./register")} className="text-dark" style={{color:'#1b6763'}}>
                  Sign In
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <div>
             <Link to="./cart" id="cart" className="cart-text mt-2" style={{ textDecoration: "none", position: "relative", fontSize: '1.5rem' }}>
            <FontAwesomeIcon icon={faCartShopping} className="mt-3 cart-text text-dark" />
            <span className="cart-count">{items.length}</span>
          </Link>
          </div>
         
        </div>

      </nav>
      <div className="m-2 mobile-search">
        {showMobileInput && (
          <input
            type="text"
            id="mobile_search_field"
            className="form-control mobile-search"
            placeholder="Search Nystai Products"
            onChange={(e) => { setKeyword(e.target.value) }}
            value={keyword}
            autoFocus
            style={{ textAlign: 'left' }}
          />
        )}
      </div>
    </div>
  );
}
