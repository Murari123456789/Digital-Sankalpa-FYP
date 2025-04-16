import React from 'react';

const WarrantyPage = () => {
  const warrantyPolicies = [
    {
      title: "Standard Warranty",
      duration: "1 Year",
      description: "All products come with a standard 1-year warranty covering manufacturing defects and malfunctions.",
      coverage: [
        "Manufacturing defects",
        "Hardware malfunctions",
        "Parts replacement",
        "Technical support"
      ]
    },
    {
      title: "Extended Warranty",
      duration: "Up to 3 Years",
      description: "Extend your product protection with our comprehensive extended warranty program.",
      coverage: [
        "All standard warranty benefits",
        "Priority service",
        "Free maintenance checkups",
        "Accidental damage protection"
      ]
    }
  ];

  const warrantyProcess = [
    {
      step: 1,
      title: "Register Your Product",
      description: "Register your product on our website or visit our store with your purchase receipt."
    },
    {
      step: 2,
      title: "Report an Issue",
      description: "Contact our support team or visit our store to report any problems with your product."
    },
    {
      step: 3,
      title: "Evaluation",
      description: "Our technical team will evaluate the issue and determine if it's covered under warranty."
    },
    {
      step: 4,
      title: "Service/Replacement",
      description: "Based on the evaluation, we'll either repair or replace your product according to warranty terms."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Warranty</h1>
        <p className="text-lg text-gray-600">Protecting your investment with comprehensive warranty coverage</p>
      </div>

      {/* Warranty Types */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {warrantyPolicies.map((policy, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{policy.title}</h2>
            <div className="text-blue-600 font-medium mb-4">{policy.duration}</div>
            <p className="text-gray-600 mb-6">{policy.description}</p>
            <h3 className="font-medium text-gray-800 mb-3">Coverage includes:</h3>
            <ul className="space-y-2">
              {policy.coverage.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Warranty Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Warranty Claim Process</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {warrantyProcess.map((process) => (
            <div key={process.step} className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <div className="text-blue-600 font-bold text-xl mb-4">Step {process.step}</div>
                <h3 className="font-semibold text-gray-800 mb-3">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Warranty?</h2>
        <p className="text-gray-600 mb-6">Our support team is here to help you with any warranty-related questions</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-800">9855080600</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-800">digitalsankalpa@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
