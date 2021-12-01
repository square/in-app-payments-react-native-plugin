import Brand from './Brand';
import PrepaidType from './PrepaidType';
import Type from './Type';

interface Card {
  brand?: Brand;

  lastFourDigits?: string;

  expirationMonth?: number;

  expirationYear?: number;

  postalCode?: string;

  type?: Type;

  prepaidType?: PrepaidType;
}
export default Card;
