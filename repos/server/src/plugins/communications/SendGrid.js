import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.EMAIL_API_KEY);

SendGrid.prototype.send = async function (payload) {
  try {
    await sgMail.send({
			from: this.options.from,
			...payload,
		});
  } catch (error) {
		console.error('[SENDGRID-send]', error);
	}
};

function SendGrid(options = {}) {
  this.name = "sendgrid-email";
  this.options = options;
}

export default SendGrid;
