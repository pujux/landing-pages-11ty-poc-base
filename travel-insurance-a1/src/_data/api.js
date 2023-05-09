require('dotenv').config();

const url = process.env.API_URL;
const base = `${url}/policy/api/v1`;

const createBasicAuthToken = (user, password) => {
  const token = Buffer.from(`${user}:${password}`).toString('base64');
  return `Basic ${token}`;
};

module.exports = {
  url: url,
  base: base,
  auth: {
    basic: createBasicAuthToken(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
    ),
  },
  methods: {
    getCustomerData: `${base}/proposals/getbyid`,
    getCustomerDataFromPartner: `${base}/policies/getcustomerdatafrompartner`,
    requestProposalLink: `${base}/proposals/requestproposallink`,
    create: `${base}/policies/create`,
    accessToken: `${url}/auth/realms/core/protocol/openid-connect/token`,
    deactivate: `${url}/travel/api/v1/travels/deactivate`,
    validateContract: `${base}/policies/hasactivecontract`,
    validateTariff: `${base}/policies/istariffeligible`,
    httpCookie: `${base}/authentication/settoken`,
    getPhoneNumber: `${base}/authentication/getphonenumber`,
    changeCover: `${url}/travel/api/v1/travels/changecover`,
  },
};
