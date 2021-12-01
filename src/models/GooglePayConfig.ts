import GooglePayPriceStatus from './GooglePayPriceStatus';

interface GooglePayConfig {
  price:string;
  currencyCode:string;
  priceStatus:GooglePayPriceStatus;
}

export default GooglePayConfig;
