import config from '../../config';
import logger from '../../loaders/logger';
import Twilio from 'twilio';

// const instance = Twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendSMS = async ({to, ip}) => {
  try{
    // await instance.verify.services(config.twilio.verifyServiceId)
    // .verifications
    // .create({rateLimits: {
    //   end_user_ip_address: ip
    // }, to, channel: 'sms'});
  }catch(error){
    logger('UTILITIES-SMS-sendSMS').error(error);
  }
}

export const verifyOTP = async ({to, otp}) => {
  try{
    // return instance.verify.services(config.twilio.verifyServiceId)
    // .verificationChecks
    // .create({to, code: otp});
  }catch(error){
    logger('UTILITIES-SMS-sendSMS').error(error);
  }
}