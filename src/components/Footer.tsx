import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Elbaker Logo" className="h-10 w-10 rounded-full object-cover border-2 border-amber-500 bg-white" />
              <div>
                <h3 className="text-xl font-bold">Elbaker</h3>
                <p className="text-sm text-amber-400">our Bakery</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafting delectable moments, one treat at a time. Experience the finest artisan baked goods made with love and premium ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Makidye Mubaraka<br />
                  Kampala, Uganda
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <a href="tel:+256780746351" className="text-gray-300 hover:text-amber-400 text-sm">
                  +256780746351
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400" />
                <a href="mailto:info5elbaker@gmail.com" className="text-gray-300 hover:text-amber-400 text-sm">
                  info5elbaker@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Opening Hours</h4>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Mon - Fri:</span>
                <span className="text-white">7:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Saturday:</span>
                <span className="text-white">8:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Sunday:</span>
                <span className="text-white">9:00 AM - 6:00 PM</span>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16Zgc45zBu/?mibextid=wwXIfr" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Elbaker our Bakery. All rights reserved. | 
            <a href="#" className="hover:text-amber-400 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-amber-400 ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;