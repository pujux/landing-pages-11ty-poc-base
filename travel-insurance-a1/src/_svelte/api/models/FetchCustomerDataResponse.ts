export interface FetchCustomerDataResponse {
  correlationId: string;
  data: Data;
  succeeded: boolean;
  message?: null;
}
interface Data {
  insuranceContractType: string;
  selectedCovers?: (null)[] | null;
  policyHolder: PolicyHolder;
  invoiceAddress?: null;
  insuredRisk: string;
  payment: Payment;
  contract: Contract;
  websitePromotionText: WebsitePromotionText;
}
export interface PolicyHolder {
  partnerUserId?: null;
  partnerReference: string;
  companyName?: null;
  email: string;
  phoneNumber: string;
  address: Address;
  gender: string;
  personType?: null;
  titlePrefix?: null;
  titleSuffix?: null;
  firstName: string;
  lastName: string;
  nationalIdentificationNumber: string;
  dateOfBirth: string;
  passport: Passport;
}
interface Address {
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
}
export interface Passport {
  passportNumber?: null;
  issuingAuthority?: null;
  placeOfIssue?: null;
  dateOfIssue?: null;
  dateOfExpiry?: null;
}
interface Payment {
  paymentType: string;
  details: {
    billingReferenceNr?: string;
  };
}
export interface Contract {
  subscriptionDate: string;
  mainInsuredPerson: MainInsuredPerson;
  additionalInsuredPersons?: (null)[] | null;
  additionalInformation: string;
  promotionCode: string;
  trackingCode: string;
  verificationMethod: string;
}
export interface MainInsuredPerson {
  companyName?: null;
  email: string;
  phoneNumber: string;
  address: Address;
  gender: string;
  personType?: null;
  titlePrefix?: null;
  titleSuffix?: null;
  firstName: string;
  lastName: string;
  nationalIdentificationNumber: string;
  dateOfBirth: string;
  passport: Passport;
}
export interface WebsitePromotionText {
  deu: string;
  srp: string;
  eng: string;
}
