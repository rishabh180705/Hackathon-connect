import React, { useState } from 'react';
import { Smartphone, User, KeyRound, Building, MapPin, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Mock Clerk hooks for demonstration purposes.
// In a real application, you would import these from '@clerk/clerk-react'.

const useSignIn = (Navigate) => ({
    isLoaded: true,
  signIn: {
    create: async (options) => {
      console.log('Clerk signIn.create called with:', options);
      // Simulate preparing for OTP verification
      return {
        supportedFirstFactors: [{ strategy: 'phone_code' }],
        async prepareFirstFactor(factor) {
           console.log('Preparing first factor:', factor);
        }
      };
    },
    attemptFirstFactor: async (options) => {
      console.log('Clerk signIn.attemptFirstFactor called with:', options);
      if (options.code === '123456') {
        console.log('Sign-in successful');
        Navigate('/home') 
        return { createdSessionId: 'sess_abc123' };
      }
      throw new Error('Invalid OTP');
    },
  },
  setActive: ({ session }) => {
    console.log('Setting active session:', session);
  },
});

const useSignUp = (Navigate) => ({
  isLoaded: true,
  signUp: {
    create: async (options) => {
      console.log('Clerk signUp.create called with:', options);
      // Simulate that the phone number requires verification
      return {
        status: 'missing_requirements',
        verifications: {
            phoneNumber: {
                prepare: async () => console.log('Preparing phone number verification.'),
                attempt: async ({ code }) => {
                    if (code === '123456') {
                        console.log('Sign-up verification successful');
                          Navigate('/home')
                        return { status: 'complete', createdSessionId: 'sess_xyz789' };
                    }
                    throw new Error('Invalid OTP');
                }
            }
        },
        async preparePhoneNumberVerification() {
            console.log('Preparing phone number verification.');
        },
        async attemptPhoneNumberVerification({ code }) {
            if (code === '123456') {
                console.log('Sign-up verification successful');
               Navigate('/home')  // Navigate to home after successful sign-up
                return { status: 'complete', createdSessionId: 'sess_xyz789' };
            }
            throw new Error('Invalid OTP');
        }
      };
    },
  },
  setActive: ({ session }) => {
    console.log('Setting active session:', session);
  },
});


// Main Authentication Component
export default function Authorization() {
  const Navigate=useNavigate();
  const [authStep, setAuthStep] = useState('initial'); // 'initial', 'login', 'signup', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpFlow, setIsSignUpFlow] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '110018',
    role: 'vendor',
  });

  // In a real app, these would be imported from '@clerk/clerk-react'
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn(Navigate);
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp(Navigate);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      if (isSignUpFlow) {
        // This is the sign-up flow
        if (!isSignUpLoaded) return;
        
        await signUp.create({
          phoneNumber: `${phoneNumber}`, // Assuming Indian numbers
        });
        await signUp.preparePhoneNumberVerification();
        setAuthStep('otp');

      } else {
        // This is the sign-in flow
        if (!isSignInLoaded) return;

        const signInAttempt = await signIn.create({
          identifier: `+91${phoneNumber}`,
        });
        
        // Assuming phone code is the first supported factor
        await signInAttempt.prepareFirstFactor({
            strategy: 'phone_code',
        });
        
        setAuthStep('otp');
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP.');
        return;
    }
    setError('');
    setIsLoading(true);

    try {
        if (isSignUpFlow) {
            if (!isSignUpLoaded) return;
            const result = await signUp.attemptPhoneNumberVerification({ code: otp });

            if (result.status === 'complete') {
                // Now, update the user with the rest of the form data
                // This part is simplified. In Clerk, you might store this in unsafeMetadata
                // upon creation or have a separate step to update the user profile.
                console.log('User created with data:', { ...formData, phoneNumber });
                await setSignUpActive({ session: result.createdSessionId });
                alert('Sign up successful!');
                resetState();
            }
        } else {
            if (!isSignInLoaded) return;
            const result = await signIn.attemptFirstFactor({
                strategy: 'phone_code',
                code: otp,
            });

            if (result.createdSessionId) {
                await setSignInActive({ session: result.createdSessionId });
                alert('Sign in successful!');
                resetState();
            }
        }
    } catch (err) {
        setError(err.errors ? err.errors[0].message : 'Invalid OTP or an error occurred.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSignUpSubmit = (e) => {
      e.preventDefault();
      // After filling the form, we proceed to send OTP for the provided number
      setIsSignUpFlow(true);
      handleSendOtp(e);
  };

  const resetState = () => {
    setAuthStep('initial');
    setPhoneNumber('');
    setOtp('');
    setError('');
    setIsLoading(false);
    setIsSignUpFlow(false);
    setFormData({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        role: 'vendor',
    });
  };

  const goBack = () => {
    if (authStep === 'otp' && isSignUpFlow) {
      setAuthStep('signup');
    } else if (authStep === 'otp' && !isSignUpFlow) {
      setAuthStep('login');
    } else {
      resetState();
    }
    setError('');
  }

  const renderInitial = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Welcome</h2>
      <p className="text-center text-gray-500 mb-8">Login or create an account to continue.</p>
      <div className="space-y-4">
        <button
          onClick={() => { setAuthStep('login'); setIsSignUpFlow(false); }}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login with Mobile
        </button>
        <button
          onClick={() => { setAuthStep('signup'); setIsSignUpFlow(true); }}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create New Account
        </button>
      </div>
    </>
  );

  const renderMobileForm = (title) => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">{title}</h2>
      <p className="text-center text-gray-500 mb-8">We'll send you a one-time password.</p>
      <form onSubmit={handleSendOtp}>
        <div className="relative mb-4">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">+91</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Your mobile number"
            className="w-full pl-20 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    </>
  );

  const renderOtpForm = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
      <p className="text-center text-gray-500 mb-8">Enter the 6-digit code sent to +91 {phoneNumber}.</p>
      <form onSubmit={handleVerifyOtp}>
        <div className="relative mb-4">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-Digit OTP"
            className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            maxLength="6"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {isLoading ? 'Verifying...' : 'Verify & Proceed'}
        </button>
      </form>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
      <p className="text-center text-gray-500 mb-8">Please fill in your details below.</p>
      <form onSubmit={handleSignUpSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField('firstName', 'First Name', 'text', <User />)}
          {renderInputField('lastName', 'Last Name', 'text', <User />)}
        </div>
        {renderInputField('phoneNumber', 'Mobile Number', 'tel', <Smartphone />, true)}
        {renderInputField('address', 'Street Address', 'text', <MapPin />)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInputField('city', 'City', 'text', <Building />)}
            {renderInputField('state', 'State', 'text', <Building />)}
        </div>
        {renderInputField('pincode', 'Pincode', 'text', <MapPin />)}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
          >
            <option value="vendor">Vendor</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300"
        >
          {isLoading ? 'Processing...' : 'Register & Verify OTP'}
        </button>
      </form>
    </>
  );

  const renderInputField = (name, placeholder, type = 'text', icon, isPhone = false) => (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 20 })}</div>}
      {isPhone && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">+91</span>}
      <input
        type={type}
        name={name}
        id={name}
        value={name === 'phoneNumber' ? phoneNumber : formData[name]}
        onChange={name === 'phoneNumber' ? (e) => setPhoneNumber(e.target.value) : handleInputChange}
        placeholder={placeholder}
        className={`w-full ${icon ? (isPhone ? 'pl-20' : 'pl-12') : 'pl-3'} pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition`}
        required
      />
    </div>
  );

  const renderContent = () => {
    switch (authStep) {
      case 'login':
        return renderMobileForm('Login');
      case 'signup':
        return renderSignUpForm();
      case 'otp':
        return renderOtpForm();
      case 'initial':
      default:
        return renderInitial();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 relative">
        {authStep !== 'initial' && (
            <button onClick={goBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition">
                <ChevronLeft size={24} />
            </button>
        )}
        {renderContent()}
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          For demo purposes, use OTP: 123456
        </p>
      </div>
    </div>
  );
}