import getConfig from "../../../config";
import { getPlugin } from "../../plugins/registry";

let emailService = null;

const getEmailService = () => {
  if (!emailService) {
    const pluginConfig = getConfig().plugins.find(plugin => plugin.key === 'email-service');
    const EmailService = getPlugin('email-service'); 

    if (EmailService) {
      emailService = new EmailService(pluginConfig.options);
    }
  }

  return emailService;
}

Email.prototype.sendEmail = async function(...args) {
  const service = getEmailService();

  if (!service) return;

  return getEmailService().sendEmail(...args);
};

function Email() {};

export default Email;