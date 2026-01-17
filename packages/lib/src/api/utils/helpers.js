import { customAlphabet } from 'nanoid/async';

export const formatJoiData = (data) => {
  const { error: { details = [] } = {} } = data;
  let isInValid = false;
  const errors = details.reduce((acc, detail) => {
    if (detail.message) {
      isInValid = true;
      acc[detail.context.label] = detail.message;
    }
    return acc;
  }, {});

  return { values: data.value, errors, isInValid };
};

export const formatFromError = (error = {}) => {
  const { status = 500, msgText = 'Something went wrong!', data = {} } = error;
  return { status, success: false, message: msgText, ...data };
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const customJoiValidators = {
  validateMobile: (value, helper) => {
    if (!/\+91[7-9][0-9]{9}$/.test(value)) {
      return helper.message('Invalid mobile');
    }

    return value;
  },
};

export const validateOTPExpiry = (generatedAt) => {
  const expiryDateTime = new Date(generatedAt);
  expiryDateTime.setMinutes(expiryDateTime.getMinutes() + 5);
  const currentDateTime = new Date();

  if (currentDateTime > expiryDateTime) {
    throw {
      status: 400,
      msgText: 'Invalid OTP!',
      error: new Error(),
    };
  }
};

export const makeRandomNanoId = async () => {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13);
  return nanoid();
};
