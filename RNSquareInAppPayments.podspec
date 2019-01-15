
Pod::Spec.new do |s|
  s.name         = "RNSquareInAppPayments"
  s.version      = "0.0.1"
  s.summary      = "React Native plugin for Square's In-App Payments SDK"
  s.description  = <<-DESC
                   An open source React Native plugin for calling Square’s native In-App Payments SDK to take in-app payments on iOS and Android.
                   DESC
  s.homepage     = "https://github.com/square/in-app-payments-react-native-plugin"
  s.license      = "Apache-2.0"
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/author/RNSquareInAppPayments.git", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}"
  s.public_header_files = 'ios/**/*.h'
  s.requires_arc = true
  s.resource_bundle = { "RNSquareInAppPayments-Resources" => ["ios/RNSquareInAppPayments-Resources/*.lproj/*.strings"] }

  s.dependency "React"
  s.dependency "SquareInAppPaymentsSDK"

end
