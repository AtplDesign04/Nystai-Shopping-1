import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import mailsend from './mailbox.png'
const Sucess = () => {
  const { loading } = useSelector(state => state.authState);
  return (
    <div className='success-page'>
      <img src={mailsend} />
      <h1>Thankyou for Choosing Nystai  </h1>
      <h2> Kindly check your E-mail inbox or junk mail for a verification link
        else wait for a while</h2>

      <Link to='/register'>
        <button
          id="cart_btn"
          className="btn btn-primary d-inline "
          disabled={loading}
        >
          Try again
        </button>
      </Link>
    </div>
  )
}

export default Sucess
