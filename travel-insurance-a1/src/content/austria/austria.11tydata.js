require('dotenv').config();

module.exports = {
  country: 'austria',
  configData: {
    countryName: {
      de: 'Österreich',
      en: 'Austria',
    },
    maxAdditionalPeople: 4,
    maxAdditionalAdults: 1,
    maxAdditionalChildren: 3,
    mainInsuredMinAge: 18,
    childMaxAge: 21,
    adultMaxAge: 70,
    usePersonalId: false,
    deriveBirthdayFromPersonalId: false,
    showRetrieveDataPermissionModal: true,
    retrieveDataPermissionMandatory: false,
    currency: '€',
    helpdeskTel: '+4350664 60260',
    helpdeskEmail: 'kundenservice@lamie-direkt.at',
    showAreaIcons: true,
    showFormIntro: true,
    requiresIdParameter: 'msisdn',
    getCustomerIdFromExternalService: true,
    externalPhoneVerificationUrl: process.env.ASMP_URL,
    getCustomerDataMethod: 'getCustomerDataFromPartner',
    validateContract: true,
    validateTariff: true,
    redirectOnSuccessTo: {
      de: 'https://www.lamie-direkt.at/reise-schutz/success',
      en: 'https://www.lamie-direkt.at/en/travelprotection/success/'
    },
    products: {
      single: {
        type: 'Travel_Insurance_A1_AUT_Single',
        prices: {
          europe: 1.99,
          worldwide: 2.99
        }
      },
      family: {
        type: 'Travel_Insurance_A1_AUT_Family',
        prices: {
          europe: 3.99,
          worldwide: 6.99
        }
      }
    },
    downloads: [
      {
        name: {
          de: "Versicherungsbedingungen",
          en: "Insurance Terms and Conditions"
        },
        link: {
          de: "https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf",
          en: "https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf"
        }
      }, {
        name: {
          de: "Informationsblatt",
          en: "Insurance Product Information Documents (=IPID)"
        },
        link: {
          de: "https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Informationsblatt.pdf",
          en: "https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Informationsblatt.pdf"
        }
      }
    ],
    form: {
      fields: [
        {
          name: 'phoneNumber',
          required: true,
          readonly: true
        }, {
          name: 'salutation',
          required: true,
          readonly: false
        }, {
          name: 'firstName',
          required: true,
          readonly: false
        }, {
          name: 'lastName',
          required: true,
          readonly: false
        }, {
          name: 'street',
          required: true,
          readonly: false
        }, {
          name: 'postalCode',
          required: true,
          readonly: false
        }, {
          name: 'city',
          required: true,
          readonly: false
        }, {
          name: 'email',
          required: true,
          readonly: false
        }, {
          name: 'dateOfBirth',
          required: true,
          readonly: false
        }
      ],
      additionalPeopleFields: [
        {
          name: 'salutation',
          required: true
        }, {
          name: 'firstName',
          required: true
        }, {
          name: 'lastName',
          required: true
        }, {
          name: 'dateOfBirth',
          required: true
        }
      ]
    },
    consentDeclarations: [
      {
        name: "roaming",
        value: "TI-A1AUT_AVB_Roaming",
        text: {
          de: 'Ja, Ich berechtige LAMIE direkt <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Roaming-Information.pdf" target="_blank" rel="noopener nofollow">Informationen über die Ein- und Ausbuchung</a> („Roaming“) meiner registrierten A1 Sim-Karte in ein ausländisches Mobilfunknetz von A1 einzuholen; Standort- oder Bewegungsdaten werden NICHT übertragen. Und ja, ich bin einverstanden, dass die <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf" target="_blank" rel="noopener nofollow">Versicherungsbedingungen</a> Vertragsinhalt werden.',
          en: 'Yes, I hereby consent to LAMIE direkt <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Roaming-Information.pdf" target="_blank" rel="noopener nofollow">to provide information about my A1 SIM card roaming</a> („Roaming“) in a foreign mobile network of A1; location and movement data will not be transmitted. And yes, I agree that the <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf" target="_blank" rel="noopener nofollow">terms of insurance</a> become part of the contract.'
        }
      }, {
        name: "consultationWaiver",
        value: "TI-A1AUT_ConsultationWaiver",
        text: {
          de: 'Ja, ich bestätige, dass das gegenständliche Versicherungsprodukt meinen Wünschen und Bedürfnissen entspricht und kein weiterer Beratungsbedarf besteht.',
          en: 'Yes, I confirm that the insurance product in question meets my needs and requirements and that further advice is needed.'
        }
      }, {
        name: "electronicCommunication",
        value: "TI-A1AUT_ElectronicCommunication",
        text: {
          de: 'Ja, ich stimme der <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/ElektronischeKommunikation.pdf" target="_blank" rel="noopener nofollow">elektronischen Kommunikation</a> mit LAMIE direkt zu. Sie erhalten unsere Mitteilungen von kundenservice@lamie-direkt.at. Tragen Sie dafür Sorge, dass unsere Nachrichten nicht geblockt sind.',
          en: 'Yes, I agree to the <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/ElektronischeKommunikation.pdf" target="_blank" rel="noopener nofollow">electronic communication</a> with LAMIE direkt. You will receive our messages from kundenservice@lamie-direkt.at. Make sure that our messages.'
        }
      },
    ]
  },
  stylesheets: [
    'austria.css'
  ],
  webfonts: 'austria-fonts.css',
  api: {
    auth: {
      username: process.env.ACCESS_TOKEN_USERNAME_AUT,
      password: process.env.ACCESS_TOKEN_PASSWORD_AUT,
      subscriptionKey: process.env.SUBSCRIPTION_KEY_AUT,
    },
    methods: {
      getCustomerData: `${process.env.API_URL_AUSTRIA}/insure/api/v1/proposals/getbyid`,
      getCustomerDataFromPartner: `${process.env.API_URL_AUSTRIA}/insure/api/v1/policies/getcustomerdatafrompartner`,
      requestProposalLink: `${process.env.API_URL_AUSTRIA}/insure/api/v1/proposals/requestproposallink`,
      create: `${process.env.API_URL_AUSTRIA}/insure/api/v1/policies/create`,
      validateContract: `${process.env.API_URL_AUSTRIA}/insure/api/v1/policies/hasactivecontract`,
      validateTariff: `${process.env.API_URL_AUSTRIA}/insure/api/v1/policies/istariffeligible`,
      httpCookie: `${process.env.API_URL_AUSTRIA}/insure/api/v1/authentication/settoken`,
      getPhoneNumber: `${process.env.API_URL_AUSTRIA}/insure/api/v1/authentication/getphonenumber`,
    }
  },
  eleventyComputed:{
    path: data => data.country,
    languages: {
      de: {
        dir: data => `/${data.country}`,
      },
      en: {
        dir: data => `/${data.country}/${data.languages.en.code}`,
      },
      sr: () => undefined,
      hr: () => undefined,
    }
  }
}
