import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/product/productDetail'
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
import store from './store'
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './components/cart/Payment';
import axios from 'axios';
import OrderSuccess from './components/cart/OrderSuccess';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import NewProduct from './components/admin/NewProduct';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ReviewList from './components/admin/ReviewList';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import VerifyEmail from './components/user/VerifyEmail';
import Sucess from './components/user/Sucess';
import SavedAddress from './components/user/SavedAddress';
import UpdateSavedAddress from './components/user/UpdateSavedAddress';
import ProductCategory from './components/product/ProductCategory';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import ScrollToTop from './components/layouts/ScrollToTop';



function App() {
  const [stripeApiKey, setStripeApiKey] = useState("")
  useEffect(() => {
    store.dispatch(loadUser)
    async function getStripeApiKey() {
      try{
        const {data} = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey) 
      } catch {
       
      }
      
    }
    getStripeApiKey()
  },[])




  return (
    <>
  <Router>
  <ScrollToTop />
      <div className="App" >
        <HelmetProvider>
          
            <Header/>
            <ToastContainer 
            theme='colored' 
            position='bottom-center'/>
            <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/search/:keyword' element={<ProductSearch/>} />
            <Route path='/category/:category' element={<ProductCategory/>} />
            <Route path='/products/:id' element={<ProductDetail/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/success' element={<Sucess/>} />
            <Route path='/verify-email/:token' element={<VerifyEmail/>} />
            <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
            <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>} />
            <Route path='/myprofile/saved-address' element={<ProtectedRoute><SavedAddress/></ProtectedRoute>} />
            <Route path='/myprofile/update-saved-address/:id' element={<ProtectedRoute><UpdateSavedAddress/></ProtectedRoute>} />
            <Route path='/password/forgot' element={<ForgotPassword/>} />
            <Route path='/password/reset/:token' element={<ResetPassword/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>} />
            <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>} />
            <Route path='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute>} />
            <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>} />
            {stripeApiKey && <Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe('pk_test_51OvdcSSIbJcFkdn6Q7FpkLZMRCVeGrgtfawKd7oqcdcgK9iFx7WX7vSbcxB8qan0GUJX2BiaEmlIQeGB55cMyqJu00kFvstK41')}><Payment/></Elements></ProtectedRoute> } /> }
            </Routes>
            
            {/* admin routes */}
            <Routes>             
            <Route path='/admin/dashboard' element={ <ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute> } />
            <Route path='/admin/products' element={ <ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute> } />
            <Route path='/admin/products/create' element={ <ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute> } />
            <Route path='/admin/products/:id' element={ <ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute> } />
            <Route path='/admin/orders' element={ <ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute> } />
            <Route path='/admin/order/:id' element={ <ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute> } />
            <Route path='/admin/users' element={ <ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute> } />
            <Route path='/admin/user/:id' element={ <ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute> } />
            <Route path='/admin/reviews' element={ <ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute> } />
            </Routes>
            <Footer/>
           
        </HelmetProvider>
      
    </div>
    </Router>
</>
    
    
  );
}

export default App;
