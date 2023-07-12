import {promises as fsPromises} from 'fs';
import path from 'path';

import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import {
  ConfigPlugin,
  withDangerousMod,
} from '@expo/config-plugins';
import { IOS_SDK_VERSION, IOS_SDK_REPO } from './constants';
import { PluginProps } from './types';

const withCocoaPodsImport: ConfigPlugin<PluginProps> = (config, props) => {
    return withDangerousMod(config, [
        'ios',
        async (config) => {
        const sdkVersion = props.ios?.sdk || IOS_SDK_VERSION;
        const file = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        const src = await fsPromises.readFile(file, 'utf8');

        const newSrc = `pod 'Cloudpayments', :git =>  '${IOS_SDK_REPO}', :tag => '${sdkVersion}'\npod 'CloudpaymentsNetworking', :git =>  '${IOS_SDK_REPO}', :tag => '${sdkVersion}'`;

        const mergedPodFile = mergeContents({
            tag: `cloudpayments-sdk-import`,
            src,
            newSrc,
            anchor: 'use_expo_modules!',
            offset: 0,
            comment: '#',
        })

        if (!mergedPodFile.didMerge) {
            console.log('ERROR: Cannot add Cloudpayments SDK to the project\'s ios/Podfile because it\'s malformed.');
            return config;
        }

        await fsPromises.writeFile(file, mergedPodFile.contents, 'utf-8');

        return config;
        },
    ]);
}

const iOsPlugin: ConfigPlugin<PluginProps> = (config, props={}) => {
    withCocoaPodsImport(config, props);
    return config;
}

export default iOsPlugin;