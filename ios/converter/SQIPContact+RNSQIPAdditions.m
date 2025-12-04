#import "SQIPContact+RNSQIPAdditions.h"
#import "SQIPCountryUtilities.h"

@implementation SQIPContact (RNSQIPAdditions)

+ (SQIPContact *)fromDictionary:(NSDictionary *)contact {
  SQIPContact *c = [[SQIPContact alloc] init];
  c.givenName = contact[@"givenName"];

  if (![contact[@"familyName"] isEqual:[NSNull null]]) {
    c.familyName = contact[@"familyName"];
  }

  if (![contact[@"email"] isEqual:[NSNull null]]) {
    c.email = contact[@"email"];
  }

  if (![contact[@"addressLines"] isEqual:[NSNull null]]) {
    c.addressLines = contact[@"addressLines"];
    NSLog(@"%@", contact[@"addressLines"]);
  }

  if (![contact[@"city"] isEqual:[NSNull null]]) {
    c.city = contact[@"city"];
  }

  if (![contact[@"region"] isEqual:[NSNull null]]) {
    c.region = contact[@"region"];
  }

  if (![contact[@"postalCode"] isEqual:[NSNull null]]) {
    c.postalCode = contact[@"postalCode"];
  }

  c.country = [SQIPCountryUtilities countryFromString:contact[@"countryCode"]];

  if (![contact[@"phone"] isEqual:[NSNull null]]) {
    c.phone = contact[@"phone"];
  }

  return c;
}

@end
