import PaymentType from './PaymentType';

interface ApplePayConfig {
  price:string;
  summaryLabel:string;
  countryCode:string;
  currencyCode:string;
  paymentType?:PaymentType;
}

export default ApplePayConfig;
