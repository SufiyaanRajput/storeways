import SendGrid from '../../plugins/communications/SendGrid';

let emailService = null;

const getEmailService = () => {
  if (!emailService) {
    emailService = new SendGrid({
      from: 'theoceanlabs@gmail.com',
    });
  }

  return emailService;
}

Email.prototype.send = async function(...args) {
  const service = getEmailService();

  if (!service) return;

  return service.send(...args);
};

function Email() {};

export default Email;