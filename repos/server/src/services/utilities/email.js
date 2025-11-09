import config from '../../config';
import logger from '../../loaders/logger';
import * as postmark from 'postmark';

const client = new postmark.ServerClient(config.postmarkKey);

export const sendEmail = ({to, subject, htmlBody, ReplyTo}) => {
  try{
    client.sendEmail({
      From: 'notifications@storeways.io',
      To: to,
      ReplyTo,
      Subject: subject,
      HtmlBody: htmlBody,
      MessageStream: 'outbound'
    });
  }catch(error){
    logger('UTILITIES-EMAIL-sendEmail').error(error);
  }
}

export const sendEmailWithTemplate = ({from, to, ReplyTo, TemplateModel, TemplateAlias}) => {
  try{
    client.sendEmailWithTemplate({
      From: from,
      ReplyTo,
      To: to,
      TemplateAlias,
      TemplateModel,
    });
  }catch(error){
    logger('UTILITIES-EMAIL-sendEmailWithTemplate').error(error);
  }
}