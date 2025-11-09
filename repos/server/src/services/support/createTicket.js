import config from '../../config';
import axios from 'axios';

const createTicket = async ({user, ...payload}) => {
  try{
    const getZohoAccessToken = async () => {
      try{
        const response = await axios.post(
          `https://accounts.zoho.in/oauth/v2/token?refresh_token=${config.ZOHO.refreshToken}&client_id=${config.ZOHO.clientId}&client_secret=${config.ZOHO.secret}&scope=Desk.tickets.CREATE&redirect_uri=https://stag.openlist.in&grant_type=refresh_token`
        );

        process.env.ZOHO_ACCESS_TOKEN = response.data.access_token;
      }catch(error){
        throw error;
      }
    }
    const createTicketRequest = async () => {
      try{
        return await axios.post('https://desk.zoho.in/api/v1/tickets', {
          departmentId: 34302000000010772,
          language : "English",
          contact: {
            lastName: user.name,
            email: user.email,
            phone: user.phone
          },
          assigneeId: "34302000000064001",
          channel : "Web",
          phone : user.phone,
          ...payload
        }, {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
            orgId: 60006539660
          }
        });
      }catch(error){
        if(error.response.status == 401){
          console.log('Zoho 401');
          await getZohoAccessToken();
          await createTicketRequest();
        }else{
          throw error;
        }
      }
    }

    await createTicketRequest();

    return 'Ticket successfully created!';
  }catch(error){
    throw error;
  }
};

export default createTicket;