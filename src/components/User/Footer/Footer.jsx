import React from "react";
import footerLogo from "../../../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const Footer = () => {
  return (
    <div className="bg-gray-50 border-t-4 border-[#fecb02] font-medium text-gray-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and company info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={footerLogo} alt="Food.VN Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-bold text-[#fecb02]">Food.VN</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Enjoy delicious dishes with Food.VN!
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-[#fecb02] transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#fecb02] transition-colors">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#fecb02] transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-6">Quick Links</h2>
            <ul className="space-y-4">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.link}
                    className="hover:text-[#fecb02] transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-[#fecb02] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Information */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-6">Useful Info</h2>
            <ul className="space-y-4">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.link}
                    className="hover:text-[#fecb02] transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-[#fecb02] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-6">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 hover:text-[#fecb02] transition-colors duration-300">
                <FaLocationArrow className="text-xl" />
                <p>Hanoi, Vietnam</p>
              </div>
              <div className="flex items-center gap-3 hover:text-[#fecb02] transition-colors duration-300">
                <FaMobileAlt className="text-xl" />
                <p>+84 123 456 789</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-600">© 2024 Food.VN. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
