require('dotenv').config();

module.exports = {
    country: 'serbia',
    configData: {
        countryName: {
            sr: 'Србија',
            en: 'Serbia'
        },
        maxAdditionalPeople: 6,
        maxAdditionalAdults: 1,
        maxAdditionalChildren: 5,
        mainInsuredMinAge: 18,
        childMaxAge: 21,
        adultMaxAge: false,
        showRetrieveDataPermissionModal: true,
        retrieveDataPermissionMandatory: true,
        deriveBirthdayFromPersonalId: true,
        currency: 'RSD',
        personalIdTerm: 'JMBG',
        helpdeskTel: '+381 60 79 99 900',
        helpdeskEmail: 'a1putnoosiguranje@lamie-direct.com',
        address: 'Beograd, Bulevar Mihajla Pupina 6',
        footer: {
            companyName: {
                sr: "Društvo za zastupanje u osiguranju LAMIE d.o.o. Beograd",
                en: "Insurance representation company LAMIE d.o.o. Belgrade"
            },
            companyRepresentation: {
                sr: "Društvo zastupa osiguravača Akcionarsko društvo za osiguranje &quot;DDOR Novi Sad&quot;",
                en: "The company is represented by the insurance company &quot;DDOR Novi Sad&quot;"
            },
            infos: [
                {
                    summary: {
                        sr: "Podaci o Društvu za zastupanje u osiguranju",
                        en: "Information about the insurance representation company"
                    },
                    details: {
                        sr: "Zastupnik u osiguranju je Društvo za zastupanje u osiguranju LAMIE d.o.o. Beograd, sa sedištem u Beogradu, Bulevar Mihajla Pupina 6, sprat 17, upisano u Registar privrednih subjekata kod Agencije za privredne registre Rešenjem broj BD 30620/2005, matični broj 21860182, PIB 113400411 i u NBS Registar društava sa ograničenom odgovornošću za zastupanje u osiguranju, broj dozvole za rad G br. 11013. Osiguravač je deo austrijske firme L'AMIE AG LIFESTYLE INSURANCE SERVICES.",
                        en: "The insurance representative is the Insurance Agent LAMIE d.o.o. Belgrade, with headquarters in Belgrade, Bulevar Mihajla Pupina 6, floor 17, registered in the Register of Business Entities at the Agency for Business Registers by Decision No. BD 30620/2005, ID number 21860182, PIB 113400411. The insurer is part of the Austrian company L'AMIE AG LIFESTYLE INSURANCE SERVICES."
                    }
                }, {
                    summary: {
                        sr: "Podaci o osiguravaču",
                        en: "Information about the insurer "
                    },
                    details: {
                        sr: "Zastupnik u osiguranju Društvo za zastupanje u osiguranju LAMIE d.o.o. Beograd zastupa osiguravača Akcionarsko društvo za osiguranje „DDOR Novi Sad\", sa sedištem u Novom Sadu, Bulevar Mihajla Pupina br. 8, upisano u Registar privrednih subjekata kod Agencije za privredne registre Rešenjem broj BD 105386/2022, matični broj 08194815, PIB 101633677. Osiguravač je deo italijanske osiguravajuće grupe UNIPOL Gruppo S.p.A. Broj telefona za korisnike usluga: +381 21 4886 000 E-mail adresa: ddor@ddor.co.rs Internet adresa: www.ddor.co.rs.",
                        en: "Insurance representative Insurance representation company LAMIE d.o.o. Belgrade represents the insurer Akcionarsko društvo za osiguranje \"DDOR Novi Sad\", with headquarters in Novi Sad, Bulevar Mihajla Pupina No. 8, entered in the Register of Business Entities at the Agency for Business Registers by Decision No. BD 105386/2022, ID No. 08194815, PIB 101633677. The insurer is part of the Italian insurance group UNIPOL Gruppo S.p.A. Telephone number for service users: +381 21 4886 000 E-mail address: ddor@ddor.co.rs Internet address: www.ddor.co.rs."
                    }
                }
            ]
        },
        requiresIdParameter: 'proposal',
        getCustomerDataMethod: 'getCustomerData',
        usePreSubmit: true,
        products: {
            single: {
                icon: 'a1',
                type: 'Travel_Insurance_A1_SRB_Single',
                prices: {
                    europe: 179,
                    worldwide: 279
                }
            },
            family: {
                icon: 'a1',
                type: 'Travel_Insurance_A1_SRB_Family',
                prices: {
                    europe: 399,
                    worldwide: 699
                }
            }
        },
        downloads: [
            {
                name: {
                    sr: "Predugovorne informacije",
                    en: "Insurance Product Information Documents"
                },
                link: {
                    sr: "https://documents.lamie-direkt.at/rs/putno_osiguranje/predugovorne_informacije.pdf",
                    en: "https://documents.lamie-direkt.at/rs/putno_osiguranje/predugovorne_informacije.pdf"
                }
            },  {
                name: {
                    sr: "Uslovi osiguranja",
                    en: "Terms and Conditions"
                },
                link: {
                    sr: "https://documents.lamie-direkt.at/rs/putno_osiguranje/uslovi_osiguranja.pdf",
                    en: "https://documents.lamie-direkt.at/rs/putno_osiguranje/terms_and_conditions.pdf"
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
                value: "TI-A1SRB_AVB_Roaming",
                text: {
                    en:
					'I confirm that I am familiar with the <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/predugovorne_informacije.pdf" target="_blank" rel="noopener nofollow">Information for the policyholder - the insured before concluding the contract</a> and <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/obavestenje_o_obradi_podataka_o_licnosti.pdf" target="_blank" rel="noopener nofollow">Information on the processing of personal data</a> for the purpose of concluding and implementing non-life insurance contract.',
					sr: 'Potvrđujem da sam upoznat/a sa <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/predugovorne_informacije.pdf" target="_blank" rel="noopener nofollow">Informacijama za ugovarača osiguranja – osiguranika pre zaključenja ugovora</a> i <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/obavestenje_o_obradi_podataka_o_licnosti.pdf" target="_blank" rel="noopener nofollow">Obaveštenjem o obradi podataka o ličnosti</a> u svrhu pristupanja i sprovođenja ugovora o neživotnom osiguranju.'
                }
            }, {
                name: "consultationWaiver",
                value: "TI-A1SRB_ConsultationWaiver",
                text: {
                    en: 'I accept that the Insurance Agency LAMIE d.o.o / LAMIE SRB d.o.o. <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/obavestenje_o_prikupljanju_informacija_o_romingu.pdf" target="_blank" rel="noopener nofollow">collects information about the roaming of my A1 SIM card</a> (“Roaming”) in the foreign mobile network A1 (location and movement data will not be transmitted).',
                    sr: 'Prihvatam da Društvo za zastupanje u osiguranju LAMIE d.o.o / LAMIE SRB d.o.o. <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/obavestenje_o_prikupljanju_informacija_o_romingu.pdf" target="_blank" rel="noopener nofollow">prikuplja informacije o romingu moje A1 SIM kartice</a> („Roming“) u stranoj mobilnoj mreži A1 (podaci o lokaciji i kretanju neće biti preneti).'
                }
            }, {
                name: "electronicCommunication",
                value: "TI-A1SRB_ElectronicCommunication",
                text: {
                    en: 'I accept the <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/terms_and_conditions.pdf" target="_blank" rel="noopener nofollow">Terms & Conditions</a> and electronic communication with LAMIE SRB d.o.o. You will receive our messages from customerservice@lamie-direct.com. Make sure our messages are not blocked.',
                    sr: 'Prihvatam <a href="https://documents.lamie-direkt.at/rs/putno_osiguranje/uslovi_osiguranja.pdf" target="_blank" rel="noopener nofollow">Uslove osiguranja</a> i elektronsku komunikaciju sa LAMIE SRB d.o.o. Naše poruke ćete primati od customerservice@lamie-direct.com. Pazite da naše poruke ne budu blokirane.'
                }
            },
        ]
    },
    api:{
        auth: {
            username: process.env.ACCESS_TOKEN_USERNAME_SRB,
            password: process.env.ACCESS_TOKEN_PASSWORD_SRB,
            subscriptionKey: process.env.SUBSCRIPTION_KEY_SRB,
        }
    },
    eleventyComputed:{
        path: data => data.country,
        languages: {
            sr: {
                dir: data => `/${data.country}`,
            },
            en: {
                dir: data => `/${data.country}/${data.languages.en.code}`,
            },
            de: () => undefined,
            hr: () => undefined,
        }
    }
}
