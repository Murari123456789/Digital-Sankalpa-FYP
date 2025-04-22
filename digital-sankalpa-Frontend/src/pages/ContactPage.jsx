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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 rounded-t-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Get in Touch</h1>
          <p className="text-blue-100 text-center text-lg max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help you find the perfect printing solution.
          </p>
        </div>
      </div>
    
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Map and Form Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form - Enhanced Design */}
          <div className="bg-white shadow-2xl rounded-xl p-8 transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden -mt-16">
            {/* Subtle Design Elements */}
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-blue-50 rounded-full opacity-30"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-blue-50 rounded-full opacity-30"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-600 rounded-full p-3 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Send a Message</h2>
              </div>
              <p className="text-gray-600 mb-8">Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.message && (
                  <div className={`p-4 rounded-lg animate-pulse ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {status.message}
                  </div>
                )}
                
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Please describe your inquiry in detail..."
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:translate-y-[-2px] hover:shadow-lg transition duration-300 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] relative group -mt-16">
            {/* Map Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        
        {/* Store Location Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8 relative overflow-hidden mb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-blue-600 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Location</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Store Address</h3>
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 font-medium">Digital Sankalpa</p>
                    <p className="text-gray-600">Newroad, Kathmandu</p>
                    <p className="text-gray-600">Nepal</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-600">+977 9855080600</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">digitalsankalpa4@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Sunday - Friday</span>
                    </div>
                    <span className="text-gray-600 font-medium">10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Saturday</span>
                    </div>
                    <span className="text-gray-600 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Cards Section - Moved to bottom */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Quick Contact Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Quick Contact</h3>
            <p className="text-gray-600 mb-6 text-center">Need immediate assistance? Reach out to us directly.</p>
            <div className="space-y-4">
              <p className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                digitalsankalpa4@gmail.com
              </p>
              <p className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +977 9855080600
              </p>
            </div>
          </div>

          {/* Visit Us Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Visit Us</h3>
            <p className="text-gray-600 mb-6 text-center">Come visit our store in person to see our products firsthand.</p>
            <div className="space-y-4">
              <p className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Newroad, Kathmandu, Nepal
              </p>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Business Hours</h3>
            <p className="text-gray-600 mb-6 text-center">Find us during these hours for in-person assistance.</p>
            <div className="space-y-4">
              <p className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Sun - Fri: 10:00 AM - 7:00 PM
              </p>
              <p className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Saturday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;