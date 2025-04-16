import React from 'react';

const LocationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Visit Digital Sankalpa</h1>
        <p className="text-lg text-gray-600">Your One-Stop Shop for Digital Solutions in Kathmandu</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
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
              <p className="text-gray-600">Phone: 9855080600</p>
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
    </div>
  );
};

export default LocationPage;
