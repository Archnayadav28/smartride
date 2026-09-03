import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [mobileData, setMobileData] = useState({ mobileNumber: '', countryCode: '+91' });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('tempRegistrationData');
    if (data) {
      setMobileData(JSON.parse(data));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (newOtp.every(v => v !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpValue: string) => {
    if (otpValue.length !== 6) return;
    
    setLoading(true);
    try {
      // For demo, accept 123456
      const response = await authService.verifyOtp(mobileData.mobileNumber, otpValue);
      
      const storedData = localStorage.getItem('tempRegistrationData');
      let finalUser = response.user;
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          finalUser = {
            ...finalUser,
            name: parsed.fullName || parsed.name || finalUser.name,
            age: parsed.age ? Number(parsed.age) : finalUser.age,
            country: parsed.country || finalUser.country,
            gender: parsed.gender || finalUser.gender,
            address: parsed.address || finalUser.address,
            preferredLanguage: parsed.preferredLanguage || finalUser.preferredLanguage,
            emergencyContact: parsed.hasEmergencyContact ? {
              name: parsed.contactName,
              relationship: parsed.contactRelationship,
              mobile: parsed.contactMobile
            } : finalUser.emergencyContact
          };
        } catch (e) {
          // ignore error
        }
      }

      // Update auth context
      login(finalUser, response.token);
      localStorage.removeItem('tempRegistrationData');
      navigate('/home');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    // In real app, call authService.resendOtp()
  };

  const maskedPhone = mobileData.mobileNumber 
    ? `${mobileData.countryCode} ${mobileData.mobileNumber.substring(0, 2)}XXX XX${mobileData.mobileNumber.substring(mobileData.mobileNumber.length - 3)}`
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-blue-600 dark:text-blue-300" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Mobile Number</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          We've sent a 6-digit OTP to {maskedPhone}
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <Button
          onClick={() => handleVerify(otp.join(''))}
          disabled={otp.some(v => v === '') || loading}
          className="w-full mb-6"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Didn't receive OTP?{' '}
          {countdown > 0 ? (
            <span>Wait {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

