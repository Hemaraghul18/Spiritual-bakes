import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Spiritual Bakes offers a delightful selection of handcrafted savory treats, made with love and the finest ingredients. Our mission is to spread joy through our freshly prepared meals, ensuring great taste and quality. Whether you’re craving something light or a hearty meal, we have the perfect option for you. Order online and enjoy a delicious experience!</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 7358611643, +91 9384321668</li>
                    <li>spiritualbakesoasis@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2025 © SpiritualBakes - All Right Reserved.</p>
    </div>
  )
}

export default Footer