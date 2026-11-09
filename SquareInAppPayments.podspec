require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "SquareInAppPayments"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => [Gem::Version.new(min_ios_version_supported), Gem::Version.new("17.1")].max.to_s }
  s.source       = { :git => "https://github.com/square/in-app-payments-react-native-plugin.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.requires_arc = true
  s.public_header_files = "ios/**/*.h"
  s.resource_bundle = { "SquareInAppPayments-Resources" => ["ios/SquareInAppPayments-Resources/*.lproj/*.strings"] }

  install_modules_dependencies(s)

  if $sqipVersion
    s.dependency 'SquareInAppPaymentsSDK', $sqipVersion
    s.dependency 'SquareBuyerVerificationSDK', $sqipVersion
  else
    s.dependency 'SquareInAppPaymentsSDK', '1.7.0'
    s.dependency 'SquareBuyerVerificationSDK', '1.7.0'
  end
end
