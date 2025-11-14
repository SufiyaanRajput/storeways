import getConfig from "../../../config";
import { getPlugin } from "../../plugins/registry";

let smsService = null;

const getSmsService = () => {
  if (!smsService) {
    const pluginConfig = getConfig().plugins.find(plugin => plugin.key === 'sms-service');
    const SmsService = getPlugin('sms-service'); 

    if (SmsService) {
      smsService = new SmsService(pluginConfig.options);
    }
  }

  return smsService;
}

SMS.prototype.sendSMS = async function(...args) {
  const service = getSmsService();

  if (!service) return;

  return getSmsService().sendSMS(...args);
};

SMS.prototype.verifyOTP = async function() {};

function SMS() {};

export default SMS;