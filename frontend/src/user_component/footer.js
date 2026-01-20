import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function PremiumFooter() {
  return (
    <footer className="pt-5 mt-5" style={{ backgroundColor: "#1a1a1a", color: "#f1f1f1" }}>
      <div className="container">
        <div className="row g-4">

          {/* Brand Info */}
          <div className="col-md-4">
            <h4 className="fw-bold" style={{ color: "#2d5a27" }}>Saakav</h4>
            <p className="small text-light-50">
              Empowering farmers with direct market access, fair pricing,
              and transparent trade across Maharashtra India.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light"><Facebook size={18} /></a>
              <a href="#" className="text-light"><Instagram size={18} /></a>
              <a href="#" className="text-light"><Twitter size={18} /></a>
              <a href="#" className="text-light"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="fw-semibold text-light">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/user/dashboard" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/user/products" className="text-light text-decoration-none">Marketplace</a></li>
              {/*<li><a href="/about" className="text-light text-decoration-none">About Us</a></li>*/}
              <li><a href="/user/helpcenter" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-3">
            <h6 className="fw-semibold text-light">Services</h6>
            <ul className="list-unstyled small">
              <li className="text-light-50">Crop Trading</li>
              <li className="text-light-50">Logistics Support</li>
              <li className="text-light-50">Price Discovery</li>
              <li className="text-light-50">Secure Payments</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h6 className="fw-semibold text-light">Contact</h6>
            <ul className="list-unstyled small">
              <li className="text-light-50 d-flex gap-2 align-items-center">
                <MapPin size={14} /> Maharashtra
              </li>
              <li className="text-light-50 d-flex gap-2 align-items-center">
                <Phone size={14} /> +91 9284128480
              </li>
              <li className="text-light-50 d-flex gap-2 align-items-center">
                <Mail size={14} /> support@saakav.in
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-light mt-4" />

        {/* Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pb-3 small text-light-50">
          <span>© {new Date().getFullYear()} Saakav. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" className="text-light-50 text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-light-50 text-decoration-none">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
