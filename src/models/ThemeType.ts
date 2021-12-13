import ColorType from './ColorType';
import FontType from './FontType';

interface ThemeType{
  font?:FontType;
  saveButtonFont?:FontType;
  backgroundColor?:ColorType;
  textColor?:ColorType;
  placeholderTextColor?:ColorType;
  tintColor?:ColorType;
  messageColor?:ColorType;
  errorColor?:ColorType;
  saveButtonTitle?:string;
  saveButtonTextColor?:ColorType;
  keyboardAppearance?:string;
  cancelButton?:any;
}
export default ThemeType;
