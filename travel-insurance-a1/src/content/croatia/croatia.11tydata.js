module.exports = {
  country: 'croatia',
  configData: {
    countryName: {
        hr: 'Hrvatska',
        en: 'Croatia'
    },
    maxAdditionalPeople: 6,
    maxAdditionalAdults: 1,
    maxAdditionalChildren: 5,
    childMaxAge: 28,
    adultMaxAge: 70,
    deriveBirthdayFromPersonalId: false,
    showRetrieveDataPermissionModal: true,
    retrieveDataPermissionMandatory: true,
    currency: ' ',
    personalIdTerm: 'OIB',
    helpdeskTel: '+43800 8084',
    helpdeskEmail: 'kundenservice@lamie-direkt.at',
    requiresIdParameter: 'proposal',
    getCustomerDataMethod: 'getCustomerData',
    products: {
      single: {
        icon: 'a1',
        type: 'Travel_Insurance_A1_HRV_Single',
        prices: {
          worldwide: '1.69 EUR / 12.73 HRK'
        }
      },
      family: {
        icon: 'a1',
        type: 'Travel_Insurance_A1_HRV_Family',
        prices: {
          worldwide: '3.99 EUR / 30.06 HRK'
        }
      }
    },
    downloads: [
      {
        name: {
          hr: "Uvjeti za osiguranje",
          en: "Terms and Conditions"
        },
        link: {
          de: "#",
          en: "#"
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
          name: 'nationalIdentificationNumber',
          required: true,
          readonly: true
        }, {
          name: 'firstName',
          required: true,
          readonly: true
        }, {
          name: 'lastName',
          required: true,
          readonly: true
        }, {
          name: 'street',
          required: true,
          readonly: true
        }, {
          name: 'postalCode',
          required: true,
          readonly: true
        }, {
          name: 'city',
          required: true,
          readonly: true
        }, {
          name: 'email',
          required: true,
          readonly: false
        }, {
          name: 'dateOfBirth',
          required: true,
          readonly: true
        }
      ],
      additionalPeopleFields: [
        {
          name: 'salutation',
          required: true
        }, {
          name: 'nationalIdentificationNumber',
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
        value: "TI-A1HRV_AVB_Roaming",
        text: {
          en: 'Yes, I hereby consent to LAMIE direkt <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Roaming-Information.pdf" target="_blank" rel="noopener nofollow">to provide information about my A1 SIM card roaming</a> („Roaming“) in a foreign mobile network of A1; location and movement data will not be transmitted. I hereby accept the <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf" target="_blank" rel="noopener nofollow">insurance conditions</a>.',
          hr: 'Da, pristajem na LAMIE direkt <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Roaming-Information.pdf" target="_blank" rel="noopener nofollow" >da pružim informacije o roamingu moje A1 SIM kartice</a> („Roaming“) u stranoj mobilnoj mreži A1; podaci o lokaciji i kretanju neće se prenositi. Ovime prihvaćam <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/Versicherungsbedingungen.pdf" target="_blank" rel="noopener nofollow">uvjete osiguranja</a >.'
        }
      }, {
        name: "consultationWaiver",
        value: "TI-A1HRV_ConsultationWaiver",
        text: {
          en: 'Yes, I confirm that the complementary insurance product meets my wishes and needs and I have no further consultation requirements.',
          hr: 'Da, potvrďam da komplementarni osigurani proizvod zadovoljava moje želje i potrebe i nema dodatnih zahtjeva za konsultacije.'
        }
      }, {
        name: "electronicCommunication",
        value: "TI-A1HRV_ElectronicCommunication",
        text: {
          en: 'Yes, I agree to the <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/ElektronischeKommunikation.pdf" target="_blank" rel="noopener nofollow">electronic communication</a> with LAMIE direkt. You will receive our messages from kundenservice@lamie-direkt.at. Please take care that our messages are not blocked.',
          hr: 'Da, prihvaćam <a href="https://documents.lamie-direkt.at/de/reiseversicherung/reise-schutz/ElektronischeKommunikation.pdf" target="_blank" rel="noopener nofollow">elektroničku komunikaciju</a> sa LAMIE direkt. Naše ćete poruke primati na kundenservice@lamie-direkt.at. Pazite da naše poruke ne budu blokirane.'
        }
      },
    ]
  },
  api: {
    auth: {
      username: process.env.ACCESS_TOKEN_USERNAME_HRV,
      password: process.env.ACCESS_TOKEN_PASSWORD_HRV,
      subscriptionKey: process.env.SUBSCRIPTION_KEY_HRV,
    }
  },
  eleventyComputed: {
    path: data => data.country,
    languages: {
      en: {
        dir: data => `/${data.country}/${data.languages.en.code}`,
      },
      hr: {
        dir: data => `/${data.country}`,
      },
      sr: () => undefined,
      de: () => undefined
    }
  }
}
