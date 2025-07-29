import React from "react";
import "../Styles/Footer.css";
import Chatbot from "../Chatbot/Chatbot";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="ext-white pt-4 pb-2">
      <div className="container-footer">
        <div className="text-white pt-4 pb-2">
          <div className="row">
            <div className="col-md-3 mb-3">
              <h5>About Us</h5>
              <p>
                We are committed to providing the best IT services to our
                customers.
              </p>
            </div>

            <div className="col-md-3">
              <div className="quick-links">
                <h5>Quick Links</h5>
                <ul class="list-unstyled">
                  <li>
                    <a
                      href="/BookFlight"
                      class="text-white text-decoration-none"
                    >
                      BookFlight
                    </a>
                  </li>
                  <li>
                    <a
                      href="/YourFlights"
                      class="text-white text-decoration-none"
                    >
                      YourFlights
                    </a>
                  </li>
                  <li>
                    <a
                      href="/MyBooking"
                      class="text-white text-decoration-none"
                    >
                      MyBooking
                    </a>
                  </li>
                  <li>
                    <a href="/Contact" class="text-white text-decoration-none">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-3 mb-12">
              <h5>Contact Us</h5>
              <p>Email:gulamnoxbondy@gmail.com</p>
              <p>Phone: +46769072199</p>
            </div>

            <div class="col-md-3 mb-12">
              <h5>Social-icons</h5>
              <div className="social-icons">
                
                <a href="https://github.com/noxbondy">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com/noxbondy">
                  <FaInstagramSquare />
                </a>
                <a href="https://youtube.com/noxbondy">
                  <FaYoutube />
                </a>
              </div>

              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
