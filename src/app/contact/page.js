"use client";

import "./Contact.css";

const Contact = () => {
  return (
    <div className="container my-5 py-5">
      <div className="text-center">
        <h1 className="display-4 mb-4">Contact Us</h1>
        <p className="lead mb-4">
          Please feel free to reach out to us at <a href="mailto:admin@cryptobriefs.net" className="font-weight-bold">admin.cryptobriefs@proton.me</a>.
        </p>
        <p className="feel_free text-muted">
          We are always available to assist you with any inquiries or concerns you may have. Whether you need information about our services, have questions about specific content, or just want to connect with our team, we are here to help. Please don't hesitate to send us an email, and we will get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
};

export default Contact;
