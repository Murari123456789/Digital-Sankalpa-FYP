import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Sending message...' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/contact/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Server response was not in the expected format');
      }

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorMessage = data?.error || 'Failed to send message. Please try again.';
        console.error('Server error:', errorMessage);
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        type: 'error',
        message: 'Failed to connect to the server. Please check your internet connection and try again.'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
      
      {/* Contact Information and Map */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Store Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Digital Sankalpa</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Address:</h3>
              <p className="text-gray-600">Newroad, Kathmandu, Nepal</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Contact:</h3>
              <p className="text-gray-600">Phone: +977 9855080600</p>
              <p className="text-gray-600">Email: digitalsankalpa4@gmail.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Store Hours:</h3>
              <p className="text-gray-600">Sunday - Friday: 10:00 AM - 7:00 PM</p>
              <p className="text-gray-600">Saturday: Closed</p>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2714812211836!2d85.31028!3d27.7045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb185ed3d6eae7%3A0x6c0a8b5b7c4bbd3f!2sDigital%20Sankalpa!5e0!3m2!1sen!2snp!4v1650123456789!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          {status.message && (
            <div className={`p-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
