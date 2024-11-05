// import React, { useState } from 'react';

// const OTPValidation = () => {
//   const [otpEnabled, setOtpEnabled] = useState(false);

//   const handleToggle = () => {
//     setOtpEnabled(prevState => !prevState);
//     // Call API to update OTP setting
//   };

//   return (
//     <div className="p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold">OTP Validation Settings</h2>
//       <label className="flex items-center">
//         <input 
//           type="checkbox" 
//           checked={otpEnabled} 
//           onChange={handleToggle} 
//           className="mr-2" 
//         />
//         Enable OTP Validation
//       </label>
//     </div>
//   );
// };

// export default OTPValidation;


import React, { useState } from 'react';

const OTPValidation = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleInputChange = (e) => {
    setOtp(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be 6 digits long.');
      return;
    }
    
    // Simulate OTP validation
    if (otp === '123456') {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">OTP Validation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2" htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
            maxLength="6"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
          Validate
        </button>
      </form>
      {isValid !== null && (
        <p className={isValid ? 'text-green-500' : 'text-red-500'}>
          {isValid ? 'OTP is valid!' : 'Invalid OTP, please try again.'}
        </p>
      )}
    </div>
  );
};

export default OTPValidation;
