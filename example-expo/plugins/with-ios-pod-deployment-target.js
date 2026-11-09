const { withPodfile } = require('@expo/config-plugins');

const MARKER = '# @generated example-ios-pod-deployment-target';

// Some dependency resource bundles still declare iOS 9. Xcode 27 rejects
// those targets even though the application uses a newer deployment target.
module.exports = function withIosPodDeploymentTarget(config) {
  return withPodfile(config, (mod) => {
    const contents = mod.modResults.contents;
    if (contents.includes(MARKER)) return mod;

    const hook = /post_install do \|installer\|/;
    if (!hook.test(contents)) {
      throw new Error(
        'Cannot set pod deployment targets: post_install hook missing'
      );
    }

    mod.modResults.contents = contents.replace(
      hook,
      `post_install do |installer|
    ${MARKER}
    minimum_ios_version = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.pods_project.targets.each do |pod_target|
      pod_target.build_configurations.each do |build_config|
        current_version = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current_version && Gem::Version.new(current_version) < Gem::Version.new(minimum_ios_version)
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = minimum_ios_version
        end
      end
    end
    # @end example-ios-pod-deployment-target
`
    );
    return mod;
  });
};
