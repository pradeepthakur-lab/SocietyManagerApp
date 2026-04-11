export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return 'Phone number must be 10 digits';
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email address';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return 'Enter a valid amount';
  return null;
};

export const validateOTP = (otp) => {
  if (!otp || otp.length !== 4) return 'Enter 4-digit OTP';
  if (!/^\d{4}$/.test(otp)) return 'OTP must contain only digits';
  return null;
};

export const validateFlatNumber = (flat) => {
  if (!flat || !flat.trim()) return 'Flat number is required';
  return null;
};
