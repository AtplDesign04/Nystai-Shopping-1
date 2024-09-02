import "./Footer.css";


export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
<>
    <footer className="footer">
      
      <div className="container">
        <div className="row footer-row">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 txt-ara">
            <center>
              <ul>
                <h4>Customer Service</h4>
                <li>
                  <a href="#">Contact Us </a>
                </li>
                <li>
                  <a href="#">Help and Advice </a>
                </li>
                <li>
                  <a href="#">Shipping and Returns </a>
                </li>
                <li>
                  <a href="#">Terms And Conditions</a>
                </li>
                <li>
                  <a href="#">Refund Policy</a>
                </li>
              </ul>
            </center>

          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 txt-ara">
            <center>
              <ul>
                <h4>Information</h4>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Testimonials</a>
                </li>
                <li>
                  <a href="#">My Account </a>
                </li>
                <li>
                  <a href="#"> Payments & Returns</a>
                </li>
                <li>
                  <a href="#">view Catalogues Online</a>
                </li>
              </ul>
            </center>
          </div>

          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 txt-ara">
            <center>
              <ul>
                <h4>About us</h4>
                <li>
                  <a href="#">Who are we ? </a>
                </li>
                <li>
                  <a href="#"> Corporate Responsibility</a>
                </li>
                <li>
                  <a href="#">India's Laws </a>
                </li>
                <li>
                  <a href="#"> Carrers</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </center>
          </div>

          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 txt-ara">
            <center>
              <ul className="contact text-dark">
                <h4 className="txt-ara">Contact us</h4>
                <li>
                  <h5 href="#">+91 81899 77700</h5>
                </li>
                <li>
                  <h5 href="#"> support@nystai.com</h5>
                </li>
                <li>
                 257, Coimbatore 
                </li>
                <li>
                   Coimbatore,
                </li>
                <li>
                  Coimbatore.
                </li>
              </ul>
            </center>
          </div>
        </div>
        <center>
        <p>Copyright &copy; {currentYear}. All Rights Reserved</p>
        </center>
      </div>
    </footer>
</>
  );
}
