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

#import "SQIPCountryUtilities.h"

@implementation SQIPCountryUtilities

+ (SQIPCountry)countryFromString:(nonnull NSString *)countryCode {
  SQIPCountry result;
  if ([@"ZZ" isEqualToString:countryCode]) {
    result = SQIPCountryZZ;
  } else if ([@"AD" isEqualToString:countryCode]) {
    result = SQIPCountryAD;
  } else if ([@"AE" isEqualToString:countryCode]) {
    result = SQIPCountryAE;
  } else if ([@"AF" isEqualToString:countryCode]) {
    result = SQIPCountryAF;
  } else if ([@"AG" isEqualToString:countryCode]) {
    result = SQIPCountryAG;
  } else if ([@"AI" isEqualToString:countryCode]) {
    result = SQIPCountryAI;
  } else if ([@"AL" isEqualToString:countryCode]) {
    result = SQIPCountryAL;
  } else if ([@"AM" isEqualToString:countryCode]) {
    result = SQIPCountryAM;
  } else if ([@"AO" isEqualToString:countryCode]) {
    result = SQIPCountryAO;
  } else if ([@"AQ" isEqualToString:countryCode]) {
    result = SQIPCountryAQ;
  } else if ([@"AR" isEqualToString:countryCode]) {
    result = SQIPCountryAR;
  } else if ([@"AS" isEqualToString:countryCode]) {
    result = SQIPCountryAS;
  } else if ([@"AT" isEqualToString:countryCode]) {
    result = SQIPCountryAT;
  } else if ([@"AU" isEqualToString:countryCode]) {
    result = SQIPCountryAU;
  } else if ([@"AW" isEqualToString:countryCode]) {
    result = SQIPCountryAW;
  } else if ([@"AX" isEqualToString:countryCode]) {
    result = SQIPCountryAX;
  } else if ([@"AZ" isEqualToString:countryCode]) {
    result = SQIPCountryAZ;
  } else if ([@"BA" isEqualToString:countryCode]) {
    result = SQIPCountryBA;
  } else if ([@"BB" isEqualToString:countryCode]) {
    result = SQIPCountryBB;
  } else if ([@"BD" isEqualToString:countryCode]) {
    result = SQIPCountryBD;
  } else if ([@"BE" isEqualToString:countryCode]) {
    result = SQIPCountryBE;
  } else if ([@"BF" isEqualToString:countryCode]) {
    result = SQIPCountryBF;
  } else if ([@"BG" isEqualToString:countryCode]) {
    result = SQIPCountryBG;
  } else if ([@"BH" isEqualToString:countryCode]) {
    result = SQIPCountryBH;
  } else if ([@"BI" isEqualToString:countryCode]) {
    result = SQIPCountryBI;
  } else if ([@"BJ" isEqualToString:countryCode]) {
    result = SQIPCountryBJ;
  } else if ([@"BL" isEqualToString:countryCode]) {
    result = SQIPCountryBL;
  } else if ([@"BM" isEqualToString:countryCode]) {
    result = SQIPCountryBM;
  } else if ([@"BN" isEqualToString:countryCode]) {
    result = SQIPCountryBN;
  } else if ([@"BO" isEqualToString:countryCode]) {
    result = SQIPCountryBO;
  } else if ([@"BQ" isEqualToString:countryCode]) {
    result = SQIPCountryBQ;
  } else if ([@"BR" isEqualToString:countryCode]) {
    result = SQIPCountryBR;
  } else if ([@"BS" isEqualToString:countryCode]) {
    result = SQIPCountryBS;
  } else if ([@"BT" isEqualToString:countryCode]) {
    result = SQIPCountryBT;
  } else if ([@"BV" isEqualToString:countryCode]) {
    result = SQIPCountryBV;
  } else if ([@"BW" isEqualToString:countryCode]) {
    result = SQIPCountryBW;
  } else if ([@"BY" isEqualToString:countryCode]) {
    result = SQIPCountryBY;
  } else if ([@"BZ" isEqualToString:countryCode]) {
    result = SQIPCountryBZ;
  } else if ([@"CA" isEqualToString:countryCode]) {
    result = SQIPCountryCA;
  } else if ([@"CC" isEqualToString:countryCode]) {
    result = SQIPCountryCC;
  } else if ([@"CD" isEqualToString:countryCode]) {
    result = SQIPCountryCD;
  } else if ([@"CF" isEqualToString:countryCode]) {
    result = SQIPCountryCF;
  } else if ([@"CG" isEqualToString:countryCode]) {
    result = SQIPCountryCG;
  } else if ([@"CH" isEqualToString:countryCode]) {
    result = SQIPCountryCH;
  } else if ([@"CI" isEqualToString:countryCode]) {
    result = SQIPCountryCI;
  } else if ([@"CK" isEqualToString:countryCode]) {
    result = SQIPCountryCK;
  } else if ([@"CL" isEqualToString:countryCode]) {
    result = SQIPCountryCL;
  } else if ([@"CM" isEqualToString:countryCode]) {
    result = SQIPCountryCM;
  } else if ([@"CN" isEqualToString:countryCode]) {
    result = SQIPCountryCN;
  } else if ([@"CO" isEqualToString:countryCode]) {
    result = SQIPCountryCO;
  } else if ([@"CR" isEqualToString:countryCode]) {
    result = SQIPCountryCR;
  } else if ([@"CU" isEqualToString:countryCode]) {
    result = SQIPCountryCU;
  } else if ([@"CV" isEqualToString:countryCode]) {
    result = SQIPCountryCV;
  } else if ([@"CW" isEqualToString:countryCode]) {
    result = SQIPCountryCW;
  } else if ([@"CX" isEqualToString:countryCode]) {
    result = SQIPCountryCX;
  } else if ([@"CY" isEqualToString:countryCode]) {
    result = SQIPCountryCY;
  } else if ([@"CZ" isEqualToString:countryCode]) {
    result = SQIPCountryCZ;
  } else if ([@"DE" isEqualToString:countryCode]) {
    result = SQIPCountryDE;
  } else if ([@"DJ" isEqualToString:countryCode]) {
    result = SQIPCountryDJ;
  } else if ([@"DK" isEqualToString:countryCode]) {
    result = SQIPCountryDK;
  } else if ([@"DM" isEqualToString:countryCode]) {
    result = SQIPCountryDM;
  } else if ([@"DO" isEqualToString:countryCode]) {
    result = SQIPCountryDO;
  } else if ([@"DZ" isEqualToString:countryCode]) {
    result = SQIPCountryDZ;
  } else if ([@"EC" isEqualToString:countryCode]) {
    result = SQIPCountryEC;
  } else if ([@"EE" isEqualToString:countryCode]) {
    result = SQIPCountryEE;
  } else if ([@"EG" isEqualToString:countryCode]) {
    result = SQIPCountryEG;
  } else if ([@"EH" isEqualToString:countryCode]) {
    result = SQIPCountryEH;
  } else if ([@"ER" isEqualToString:countryCode]) {
    result = SQIPCountryER;
  } else if ([@"ES" isEqualToString:countryCode]) {
    result = SQIPCountryES;
  } else if ([@"ET" isEqualToString:countryCode]) {
    result = SQIPCountryET;
  } else if ([@"FI" isEqualToString:countryCode]) {
    result = SQIPCountryFI;
  } else if ([@"FJ" isEqualToString:countryCode]) {
    result = SQIPCountryFJ;
  } else if ([@"FK" isEqualToString:countryCode]) {
    result = SQIPCountryFK;
  } else if ([@"FM" isEqualToString:countryCode]) {
    result = SQIPCountryFM;
  } else if ([@"FO" isEqualToString:countryCode]) {
    result = SQIPCountryFO;
  } else if ([@"FR" isEqualToString:countryCode]) {
    result = SQIPCountryFR;
  } else if ([@"GA" isEqualToString:countryCode]) {
    result = SQIPCountryGA;
  } else if ([@"GB" isEqualToString:countryCode]) {
    result = SQIPCountryGB;
  } else if ([@"GD" isEqualToString:countryCode]) {
    result = SQIPCountryGD;
  } else if ([@"GE" isEqualToString:countryCode]) {
    result = SQIPCountryGE;
  } else if ([@"GF" isEqualToString:countryCode]) {
    result = SQIPCountryGF;
  } else if ([@"GG" isEqualToString:countryCode]) {
    result = SQIPCountryGG;
  } else if ([@"GH" isEqualToString:countryCode]) {
    result = SQIPCountryGH;
  } else if ([@"GI" isEqualToString:countryCode]) {
    result = SQIPCountryGI;
  } else if ([@"GL" isEqualToString:countryCode]) {
    result = SQIPCountryGL;
  } else if ([@"GM" isEqualToString:countryCode]) {
    result = SQIPCountryGM;
  } else if ([@"GN" isEqualToString:countryCode]) {
    result = SQIPCountryGN;
  } else if ([@"GP" isEqualToString:countryCode]) {
    result = SQIPCountryGP;
  } else if ([@"GQ" isEqualToString:countryCode]) {
    result = SQIPCountryGQ;
  } else if ([@"GR" isEqualToString:countryCode]) {
    result = SQIPCountryGR;
  } else if ([@"GS" isEqualToString:countryCode]) {
    result = SQIPCountryGS;
  } else if ([@"GT" isEqualToString:countryCode]) {
    result = SQIPCountryGT;
  } else if ([@"GU" isEqualToString:countryCode]) {
    result = SQIPCountryGU;
  } else if ([@"GW" isEqualToString:countryCode]) {
    result = SQIPCountryGW;
  } else if ([@"GY" isEqualToString:countryCode]) {
    result = SQIPCountryGY;
  } else if ([@"HK" isEqualToString:countryCode]) {
    result = SQIPCountryHK;
  } else if ([@"HM" isEqualToString:countryCode]) {
    result = SQIPCountryHM;
  } else if ([@"HN" isEqualToString:countryCode]) {
    result = SQIPCountryHN;
  } else if ([@"HR" isEqualToString:countryCode]) {
    result = SQIPCountryHR;
  } else if ([@"HT" isEqualToString:countryCode]) {
    result = SQIPCountryHT;
  } else if ([@"HU" isEqualToString:countryCode]) {
    result = SQIPCountryHU;
  } else if ([@"ID" isEqualToString:countryCode]) {
    result = SQIPCountryID;
  } else if ([@"IE" isEqualToString:countryCode]) {
    result = SQIPCountryIE;
  } else if ([@"IL" isEqualToString:countryCode]) {
    result = SQIPCountryIL;
  } else if ([@"IM" isEqualToString:countryCode]) {
    result = SQIPCountryIM;
  } else if ([@"IN" isEqualToString:countryCode]) {
    result = SQIPCountryIN;
  } else if ([@"IO" isEqualToString:countryCode]) {
    result = SQIPCountryIO;
  } else if ([@"IQ" isEqualToString:countryCode]) {
    result = SQIPCountryIQ;
  } else if ([@"IR" isEqualToString:countryCode]) {
    result = SQIPCountryIR;
  } else if ([@"IS" isEqualToString:countryCode]) {
    result = SQIPCountryIS;
  } else if ([@"IT" isEqualToString:countryCode]) {
    result = SQIPCountryIT;
  } else if ([@"JE" isEqualToString:countryCode]) {
    result = SQIPCountryJE;
  } else if ([@"JM" isEqualToString:countryCode]) {
    result = SQIPCountryJM;
  } else if ([@"JO" isEqualToString:countryCode]) {
    result = SQIPCountryJO;
  } else if ([@"JP" isEqualToString:countryCode]) {
    result = SQIPCountryJP;
  } else if ([@"KE" isEqualToString:countryCode]) {
    result = SQIPCountryKE;
  } else if ([@"KG" isEqualToString:countryCode]) {
    result = SQIPCountryKG;
  } else if ([@"KH" isEqualToString:countryCode]) {
    result = SQIPCountryKH;
  } else if ([@"KI" isEqualToString:countryCode]) {
    result = SQIPCountryKI;
  } else if ([@"KM" isEqualToString:countryCode]) {
    result = SQIPCountryKM;
  } else if ([@"KN" isEqualToString:countryCode]) {
    result = SQIPCountryKN;
  } else if ([@"KP" isEqualToString:countryCode]) {
    result = SQIPCountryKP;
  } else if ([@"KR" isEqualToString:countryCode]) {
    result = SQIPCountryKR;
  } else if ([@"KW" isEqualToString:countryCode]) {
    result = SQIPCountryKW;
  } else if ([@"KY" isEqualToString:countryCode]) {
    result = SQIPCountryKY;
  } else if ([@"KZ" isEqualToString:countryCode]) {
    result = SQIPCountryKZ;
  } else if ([@"LA" isEqualToString:countryCode]) {
    result = SQIPCountryLA;
  } else if ([@"LB" isEqualToString:countryCode]) {
    result = SQIPCountryLB;
  } else if ([@"LC" isEqualToString:countryCode]) {
    result = SQIPCountryLC;
  } else if ([@"LI" isEqualToString:countryCode]) {
    result = SQIPCountryLI;
  } else if ([@"LK" isEqualToString:countryCode]) {
    result = SQIPCountryLK;
  } else if ([@"LR" isEqualToString:countryCode]) {
    result = SQIPCountryLR;
  } else if ([@"LS" isEqualToString:countryCode]) {
    result = SQIPCountryLS;
  } else if ([@"LT" isEqualToString:countryCode]) {
    result = SQIPCountryLT;
  } else if ([@"LU" isEqualToString:countryCode]) {
    result = SQIPCountryLU;
  } else if ([@"LV" isEqualToString:countryCode]) {
    result = SQIPCountryLV;
  } else if ([@"LY" isEqualToString:countryCode]) {
    result = SQIPCountryLY;
  } else if ([@"MA" isEqualToString:countryCode]) {
    result = SQIPCountryMA;
  } else if ([@"MC" isEqualToString:countryCode]) {
    result = SQIPCountryMC;
  } else if ([@"MD" isEqualToString:countryCode]) {
    result = SQIPCountryMD;
  } else if ([@"ME" isEqualToString:countryCode]) {
    result = SQIPCountryME;
  } else if ([@"MF" isEqualToString:countryCode]) {
    result = SQIPCountryMF;
  } else if ([@"MG" isEqualToString:countryCode]) {
    result = SQIPCountryMG;
  } else if ([@"MH" isEqualToString:countryCode]) {
    result = SQIPCountryMH;
  } else if ([@"MK" isEqualToString:countryCode]) {
    result = SQIPCountryMK;
  } else if ([@"ML" isEqualToString:countryCode]) {
    result = SQIPCountryML;
  } else if ([@"MM" isEqualToString:countryCode]) {
    result = SQIPCountryMM;
  } else if ([@"MN" isEqualToString:countryCode]) {
    result = SQIPCountryMN;
  } else if ([@"MO" isEqualToString:countryCode]) {
    result = SQIPCountryMO;
  } else if ([@"MP" isEqualToString:countryCode]) {
    result = SQIPCountryMP;
  } else if ([@"MQ" isEqualToString:countryCode]) {
    result = SQIPCountryMQ;
  } else if ([@"MR" isEqualToString:countryCode]) {
    result = SQIPCountryMR;
  } else if ([@"MS" isEqualToString:countryCode]) {
    result = SQIPCountryMS;
  } else if ([@"MT" isEqualToString:countryCode]) {
    result = SQIPCountryMT;
  } else if ([@"MU" isEqualToString:countryCode]) {
    result = SQIPCountryMU;
  } else if ([@"MV" isEqualToString:countryCode]) {
    result = SQIPCountryMV;
  } else if ([@"MW" isEqualToString:countryCode]) {
    result = SQIPCountryMW;
  } else if ([@"MX" isEqualToString:countryCode]) {
    result = SQIPCountryMX;
  } else if ([@"MY" isEqualToString:countryCode]) {
    result = SQIPCountryMY;
  } else if ([@"MZ" isEqualToString:countryCode]) {
    result = SQIPCountryMZ;
  } else if ([@"NA" isEqualToString:countryCode]) {
    result = SQIPCountryNA;
  } else if ([@"NC" isEqualToString:countryCode]) {
    result = SQIPCountryNC;
  } else if ([@"NE" isEqualToString:countryCode]) {
    result = SQIPCountryNE;
  } else if ([@"NF" isEqualToString:countryCode]) {
    result = SQIPCountryNF;
  } else if ([@"NG" isEqualToString:countryCode]) {
    result = SQIPCountryNG;
  } else if ([@"NI" isEqualToString:countryCode]) {
    result = SQIPCountryNI;
  } else if ([@"NL" isEqualToString:countryCode]) {
    result = SQIPCountryNL;
  } else if ([@"NO" isEqualToString:countryCode]) {
    result = SQIPCountryNO;
  } else if ([@"NP" isEqualToString:countryCode]) {
    result = SQIPCountryNP;
  } else if ([@"NR" isEqualToString:countryCode]) {
    result = SQIPCountryNR;
  } else if ([@"NU" isEqualToString:countryCode]) {
    result = SQIPCountryNU;
  } else if ([@"NZ" isEqualToString:countryCode]) {
    result = SQIPCountryNZ;
  } else if ([@"OM" isEqualToString:countryCode]) {
    result = SQIPCountryOM;
  } else if ([@"PA" isEqualToString:countryCode]) {
    result = SQIPCountryPA;
  } else if ([@"PE" isEqualToString:countryCode]) {
    result = SQIPCountryPE;
  } else if ([@"PF" isEqualToString:countryCode]) {
    result = SQIPCountryPF;
  } else if ([@"PG" isEqualToString:countryCode]) {
    result = SQIPCountryPG;
  } else if ([@"PH" isEqualToString:countryCode]) {
    result = SQIPCountryPH;
  } else if ([@"PK" isEqualToString:countryCode]) {
    result = SQIPCountryPK;
  } else if ([@"PL" isEqualToString:countryCode]) {
    result = SQIPCountryPL;
  } else if ([@"PM" isEqualToString:countryCode]) {
    result = SQIPCountryPM;
  } else if ([@"PN" isEqualToString:countryCode]) {
    result = SQIPCountryPN;
  } else if ([@"PR" isEqualToString:countryCode]) {
    result = SQIPCountryPR;
  } else if ([@"PS" isEqualToString:countryCode]) {
    result = SQIPCountryPS;
  } else if ([@"PT" isEqualToString:countryCode]) {
    result = SQIPCountryPT;
  } else if ([@"PW" isEqualToString:countryCode]) {
    result = SQIPCountryPW;
  } else if ([@"PY" isEqualToString:countryCode]) {
    result = SQIPCountryPY;
  } else if ([@"QA" isEqualToString:countryCode]) {
    result = SQIPCountryQA;
  } else if ([@"RE" isEqualToString:countryCode]) {
    result = SQIPCountryRE;
  } else if ([@"RO" isEqualToString:countryCode]) {
    result = SQIPCountryRO;
  } else if ([@"RS" isEqualToString:countryCode]) {
    result = SQIPCountryRS;
  } else if ([@"RU" isEqualToString:countryCode]) {
    result = SQIPCountryRU;
  } else if ([@"RW" isEqualToString:countryCode]) {
    result = SQIPCountryRW;
  } else if ([@"SA" isEqualToString:countryCode]) {
    result = SQIPCountrySA;
  } else if ([@"SB" isEqualToString:countryCode]) {
    result = SQIPCountrySB;
  } else if ([@"SC" isEqualToString:countryCode]) {
    result = SQIPCountrySC;
  } else if ([@"SD" isEqualToString:countryCode]) {
    result = SQIPCountrySD;
  } else if ([@"SE" isEqualToString:countryCode]) {
    result = SQIPCountrySE;
  } else if ([@"SG" isEqualToString:countryCode]) {
    result = SQIPCountrySG;
  } else if ([@"SH" isEqualToString:countryCode]) {
    result = SQIPCountrySH;
  } else if ([@"SI" isEqualToString:countryCode]) {
    result = SQIPCountrySI;
  } else if ([@"SJ" isEqualToString:countryCode]) {
    result = SQIPCountrySJ;
  } else if ([@"SK" isEqualToString:countryCode]) {
    result = SQIPCountrySK;
  } else if ([@"SL" isEqualToString:countryCode]) {
    result = SQIPCountrySL;
  } else if ([@"SM" isEqualToString:countryCode]) {
    result = SQIPCountrySM;
  } else if ([@"SN" isEqualToString:countryCode]) {
    result = SQIPCountrySN;
  } else if ([@"SO" isEqualToString:countryCode]) {
    result = SQIPCountrySO;
  } else if ([@"SR" isEqualToString:countryCode]) {
    result = SQIPCountrySR;
  } else if ([@"SS" isEqualToString:countryCode]) {
    result = SQIPCountrySS;
  } else if ([@"ST" isEqualToString:countryCode]) {
    result = SQIPCountryST;
  } else if ([@"SV" isEqualToString:countryCode]) {
    result = SQIPCountrySV;
  } else if ([@"SX" isEqualToString:countryCode]) {
    result = SQIPCountrySX;
  } else if ([@"SY" isEqualToString:countryCode]) {
    result = SQIPCountrySY;
  } else if ([@"SZ" isEqualToString:countryCode]) {
    result = SQIPCountrySZ;
  } else if ([@"TC" isEqualToString:countryCode]) {
    result = SQIPCountryTC;
  } else if ([@"TD" isEqualToString:countryCode]) {
    result = SQIPCountryTD;
  } else if ([@"TF" isEqualToString:countryCode]) {
    result = SQIPCountryTF;
  } else if ([@"TG" isEqualToString:countryCode]) {
    result = SQIPCountryTG;
  } else if ([@"TH" isEqualToString:countryCode]) {
    result = SQIPCountryTH;
  } else if ([@"TJ" isEqualToString:countryCode]) {
    result = SQIPCountryTJ;
  } else if ([@"TK" isEqualToString:countryCode]) {
    result = SQIPCountryTK;
  } else if ([@"TL" isEqualToString:countryCode]) {
    result = SQIPCountryTL;
  } else if ([@"TM" isEqualToString:countryCode]) {
    result = SQIPCountryTM;
  } else if ([@"TN" isEqualToString:countryCode]) {
    result = SQIPCountryTN;
  } else if ([@"TO" isEqualToString:countryCode]) {
    result = SQIPCountryTO;
  } else if ([@"TR" isEqualToString:countryCode]) {
    result = SQIPCountryTR;
  } else if ([@"TT" isEqualToString:countryCode]) {
    result = SQIPCountryTT;
  } else if ([@"TV" isEqualToString:countryCode]) {
    result = SQIPCountryTV;
  } else if ([@"TW" isEqualToString:countryCode]) {
    result = SQIPCountryTW;
  } else if ([@"TZ" isEqualToString:countryCode]) {
    result = SQIPCountryTZ;
  } else if ([@"UA" isEqualToString:countryCode]) {
    result = SQIPCountryUA;
  } else if ([@"UG" isEqualToString:countryCode]) {
    result = SQIPCountryUG;
  } else if ([@"UM" isEqualToString:countryCode]) {
    result = SQIPCountryUM;
  } else if ([@"US" isEqualToString:countryCode]) {
    result = SQIPCountryUS;
  } else if ([@"UY" isEqualToString:countryCode]) {
    result = SQIPCountryUY;
  } else if ([@"UZ" isEqualToString:countryCode]) {
    result = SQIPCountryUZ;
  } else if ([@"VA" isEqualToString:countryCode]) {
    result = SQIPCountryVA;
  } else if ([@"VC" isEqualToString:countryCode]) {
    result = SQIPCountryVC;
  } else if ([@"VE" isEqualToString:countryCode]) {
    result = SQIPCountryVE;
  } else if ([@"VG" isEqualToString:countryCode]) {
    result = SQIPCountryVG;
  } else if ([@"VI" isEqualToString:countryCode]) {
    result = SQIPCountryVI;
  } else if ([@"VN" isEqualToString:countryCode]) {
    result = SQIPCountryVN;
  } else if ([@"VU" isEqualToString:countryCode]) {
    result = SQIPCountryVU;
  } else if ([@"WF" isEqualToString:countryCode]) {
    result = SQIPCountryWF;
  } else if ([@"WS" isEqualToString:countryCode]) {
    result = SQIPCountryWS;
  } else if ([@"YE" isEqualToString:countryCode]) {
    result = SQIPCountryYE;
  } else if ([@"YT" isEqualToString:countryCode]) {
    result = SQIPCountryYT;
  } else if ([@"ZA" isEqualToString:countryCode]) {
    result = SQIPCountryZA;
  } else if ([@"ZM" isEqualToString:countryCode]) {
    result = SQIPCountryZM;
  } else if ([@"ZW" isEqualToString:countryCode]) {
    result = SQIPCountryZW;
  } else {
    result = SQIPCountryUNKNOWN;
  }

  return result;
}

@end
