using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace In.App.Payments.React.Native.Plugin.RNInAppPaymentsReactNativePlugin
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNInAppPaymentsReactNativePluginModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNInAppPaymentsReactNativePluginModule"/>.
        /// </summary>
        internal RNInAppPaymentsReactNativePluginModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNInAppPaymentsReactNativePlugin";
            }
        }
    }
}
