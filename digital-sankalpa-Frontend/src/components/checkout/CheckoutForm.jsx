const CheckoutForm = ({ shippingInfo, onChange, onSubmit }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">Shipping Information</h2>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="input-field"
                value={shippingInfo.firstName}
                onChange={onChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="input-field"
                value={shippingInfo.lastName}
                onChange={onChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                value={shippingInfo.email}
                onChange={onChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                value={shippingInfo.phone}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="input-field"
                value={shippingInfo.address}
                onChange={onChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="city" className="form-label">City</label>
              <input
                id="city"
                name="city"
                type="text"
                className="input-field"
                value={shippingInfo.city}
                onChange={onChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="postalCode" className="form-label">Postal Code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className="input-field"
                value={shippingInfo.postalCode}
                onChange={onChange}
                required
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default CheckoutForm;