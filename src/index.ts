import {
  ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from "@expo/config-plugins";

import iOsPlugin from './withIOSCloudPaymets';
import androidPlugin from "./withAndroidCloudPayments";
import { PluginProps } from './types';

let pkg: { name: string; version?: string } = {
    name: "react-native-cloudpayments-sdk",
  };

try {
  pkg = require('react-native-cloudpayments-sdk/package.json');
} catch {}

const withCloudPayments: ConfigPlugin<PluginProps> = (config, props) => {
    return withPlugins(config, [
        [iOsPlugin, props],
        [androidPlugin, props]
    ])
  };

  export default createRunOncePlugin(withCloudPayments, pkg.name, pkg.version);