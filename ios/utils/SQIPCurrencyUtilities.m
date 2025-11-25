/*
 Copyright 2022 Square Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

#import "SQIPCurrencyUtilities.h"

@implementation SQIPCurrencyUtilities

+ (SQIPCurrency)currencyFromString:(nonnull NSString *)currencyCode {
  SQIPCurrency result;
  if ([@"AED" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAED;
  } else if ([@"AFN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAFN;
  } else if ([@"AFN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAFN;
  } else if ([@"ALL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyALL;
  } else if ([@"AMD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAMD;
  } else if ([@"ANG" isEqualToString:currencyCode]) {
    result = SQIPCurrencyANG;
  } else if ([@"AOA" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAOA;
  } else if ([@"ARS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyARS;
  } else if ([@"AUD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAUD;
  } else if ([@"AWG" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAWG;
  } else if ([@"AZN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyAZN;
  } else if ([@"BAM" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBAM;
  } else if ([@"BBD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBBD;
  } else if ([@"BDT" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBDT;
  } else if ([@"BGN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBGN;
  } else if ([@"BHD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBHD;
  } else if ([@"BIF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBIF;
  } else if ([@"BMD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBMD;
  } else if ([@"BND" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBND;
  } else if ([@"BOB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBOB;
  } else if ([@"BOV" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBOV;
  } else if ([@"BRL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBRL;
  } else if ([@"BSD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBSD;
  } else if ([@"BTN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBTN;
  } else if ([@"BWP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBWP;
  } else if ([@"BYR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBYR;
  } else if ([@"BZD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBZD;
  } else if ([@"CAD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCAD;
  } else if ([@"CDF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCDF;
  } else if ([@"CHE" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCHE;
  } else if ([@"CHF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCHF;
  } else if ([@"CHW" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCHW;
  } else if ([@"CLF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCLF;
  } else if ([@"CLP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCLP;
  } else if ([@"CNY" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCNY;
  } else if ([@"COP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCOP;
  } else if ([@"COU" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCOU;
  } else if ([@"CRC" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCRC;
  } else if ([@"CUC" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCUC;
  } else if ([@"CUP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCUP;
  } else if ([@"CVE" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCVE;
  } else if ([@"CZK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyCZK;
  } else if ([@"DJF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyDJF;
  } else if ([@"DKK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyDKK;
  } else if ([@"DOP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyDOP;
  } else if ([@"DZD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyDZD;
  } else if ([@"EGP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyEGP;
  } else if ([@"ERN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyERN;
  } else if ([@"ETB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyETB;
  } else if ([@"EUR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyEUR;
  } else if ([@"FJD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyFJD;
  } else if ([@"FKP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyFKP;
  } else if ([@"GBP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGBP;
  } else if ([@"GEL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGEL;
  } else if ([@"GHS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGHS;
  } else if ([@"GIP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGIP;
  } else if ([@"GMD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGMD;
  } else if ([@"GNF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGNF;
  } else if ([@"GTQ" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGTQ;
  } else if ([@"GYD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyGYD;
  } else if ([@"HKD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyHKD;
  } else if ([@"HNL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyHNL;
  } else if ([@"HRK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyHRK;
  } else if ([@"HTG" isEqualToString:currencyCode]) {
    result = SQIPCurrencyHTG;
  } else if ([@"HUF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyHUF;
  } else if ([@"IDR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyIDR;
  } else if ([@"ILS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyILS;
  } else if ([@"INR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyINR;
  } else if ([@"IQD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyIQD;
  } else if ([@"IRR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyIRR;
  } else if ([@"ISK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyISK;
  } else if ([@"JMD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyJMD;
  } else if ([@"JOD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyJOD;
  } else if ([@"JPY" isEqualToString:currencyCode]) {
    result = SQIPCurrencyJPY;
  } else if ([@"KES" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKES;
  } else if ([@"KGS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKGS;
  } else if ([@"KHR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKHR;
  } else if ([@"KMF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKMF;
  } else if ([@"KPW" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKPW;
  } else if ([@"KRW" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKRW;
  } else if ([@"KWD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKWD;
  } else if ([@"KYD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKYD;
  } else if ([@"KZT" isEqualToString:currencyCode]) {
    result = SQIPCurrencyKZT;
  } else if ([@"LAK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLAK;
  } else if ([@"LBP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLBP;
  } else if ([@"LKR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLKR;
  } else if ([@"LRD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLRD;
  } else if ([@"LSL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLSL;
  } else if ([@"LTL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLTL;
  } else if ([@"LVL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLVL;
  } else if ([@"LYD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyLYD;
  } else if ([@"MAD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMAD;
  } else if ([@"MDL" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMDL;
  } else if ([@"MGA" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMGA;
  } else if ([@"MKD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMKD;
  } else if ([@"MMK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMMK;
  } else if ([@"MNT" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMNT;
  } else if ([@"MOP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMOP;
  } else if ([@"MRO" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMRO;
  } else if ([@"MUR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMUR;
  } else if ([@"MVR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMVR;
  } else if ([@"MWK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMWK;
  } else if ([@"MXN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMXN;
  } else if ([@"MXV" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMXV;
  } else if ([@"MYR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMYR;
  } else if ([@"MZN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyMZN;
  } else if ([@"NAD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNAD;
  } else if ([@"NGN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNGN;
  } else if ([@"NIO" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNIO;
  } else if ([@"NOK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNOK;
  } else if ([@"NPR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNPR;
  } else if ([@"NZD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyNZD;
  } else if ([@"OMR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyOMR;
  } else if ([@"PAB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPAB;
  } else if ([@"PEN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPEN;
  } else if ([@"PGK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPGK;
  } else if ([@"PHP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPHP;
  } else if ([@"PKR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPKR;
  } else if ([@"PLN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPLN;
  } else if ([@"PYG" isEqualToString:currencyCode]) {
    result = SQIPCurrencyPYG;
  } else if ([@"QAR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyQAR;
  } else if ([@"RON" isEqualToString:currencyCode]) {
    result = SQIPCurrencyRON;
  } else if ([@"RSD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyRSD;
  } else if ([@"RUB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyRUB;
  } else if ([@"RWF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyRWF;
  } else if ([@"SAR" isEqualToString:currencyCode]) {
    result = SQIPCurrencySAR;
  } else if ([@"SBD" isEqualToString:currencyCode]) {
    result = SQIPCurrencySBD;
  } else if ([@"SCR" isEqualToString:currencyCode]) {
    result = SQIPCurrencySCR;
  } else if ([@"SDG" isEqualToString:currencyCode]) {
    result = SQIPCurrencySDG;
  } else if ([@"SEK" isEqualToString:currencyCode]) {
    result = SQIPCurrencySEK;
  } else if ([@"SGD" isEqualToString:currencyCode]) {
    result = SQIPCurrencySGD;
  } else if ([@"SHP" isEqualToString:currencyCode]) {
    result = SQIPCurrencySHP;
  } else if ([@"SLL" isEqualToString:currencyCode]) {
    result = SQIPCurrencySLL;
  } else if ([@"SOS" isEqualToString:currencyCode]) {
    result = SQIPCurrencySOS;
  } else if ([@"SRD" isEqualToString:currencyCode]) {
    result = SQIPCurrencySRD;
  } else if ([@"SSP" isEqualToString:currencyCode]) {
    result = SQIPCurrencySSP;
  } else if ([@"STD" isEqualToString:currencyCode]) {
    result = SQIPCurrencySTD;
  } else if ([@"SVC" isEqualToString:currencyCode]) {
    result = SQIPCurrencySVC;
  } else if ([@"SYP" isEqualToString:currencyCode]) {
    result = SQIPCurrencySYP;
  } else if ([@"SZL" isEqualToString:currencyCode]) {
    result = SQIPCurrencySZL;
  } else if ([@"THB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTHB;
  } else if ([@"TJS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTJS;
  } else if ([@"TMT" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTMT;
  } else if ([@"TND" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTND;
  } else if ([@"TOP" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTOP;
  } else if ([@"TRY" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTRY;
  } else if ([@"TTD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTTD;
  } else if ([@"TWD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTWD;
  } else if ([@"TZS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyTZS;
  } else if ([@"UAH" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUAH;
  } else if ([@"UGX" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUGX;
  } else if ([@"USD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUSD;
  } else if ([@"USN" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUSN;
  } else if ([@"USS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUSS;
  } else if ([@"UYI" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUYI;
  } else if ([@"UYU" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUYU;
  } else if ([@"UZS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyUZS;
  } else if ([@"VEF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyVEF;
  } else if ([@"VND" isEqualToString:currencyCode]) {
    result = SQIPCurrencyVND;
  } else if ([@"VUV" isEqualToString:currencyCode]) {
    result = SQIPCurrencyVUV;
  } else if ([@"WST" isEqualToString:currencyCode]) {
    result = SQIPCurrencyWST;
  } else if ([@"XAF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXAF;
  } else if ([@"XAG" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXAG;
  } else if ([@"XAU" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXAU;
  } else if ([@"XBA" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXBA;
  } else if ([@"XBB" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXBB;
  } else if ([@"XBC" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXBC;
  } else if ([@"XBD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXBD;
  } else if ([@"XCD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXCD;
  } else if ([@"XDR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXDR;
  } else if ([@"XOF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXOF;
  } else if ([@"XPD" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXPD;
  } else if ([@"XPF" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXPF;
  } else if ([@"XPT" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXPT;
  } else if ([@"XTS" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXTS;
  } else if ([@"XXX" isEqualToString:currencyCode]) {
    result = SQIPCurrencyXXX;
  } else if ([@"YER" isEqualToString:currencyCode]) {
    result = SQIPCurrencyYER;
  } else if ([@"ZAR" isEqualToString:currencyCode]) {
    result = SQIPCurrencyZAR;
  } else if ([@"ZMK" isEqualToString:currencyCode]) {
    result = SQIPCurrencyZMK;
  } else if ([@"ZMW" isEqualToString:currencyCode]) {
    result = SQIPCurrencyZMW;
  } else if ([@"BTC" isEqualToString:currencyCode]) {
    result = SQIPCurrencyBTC;
  } else {
    result = SQIPCurrencyUNKNOWN;
  }
  return result;
}

@end
