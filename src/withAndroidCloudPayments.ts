import {AndroidConfig, withAndroidManifest, withProjectBuildGradle, withAppBuildGradle, ConfigPlugin}  from "@expo/config-plugins";
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';

import { PluginProps } from './types';
import {ANDROID_SDK_VERSION} from './constants';

const {
    addMetaDataItemToMainApplication,
    getMainApplicationOrThrow,
  } = AndroidConfig.Manifest;



const modifyAndroidManifest: ConfigPlugin<PluginProps> = (config, props) => {
    const META_NAME = 'com.google.android.gms.wallet.api.enabled';

    return withAndroidManifest(config, (configWithProps) => {
        const mainApplication = getMainApplicationOrThrow(configWithProps.modResults);

        if (!mainApplication) return configWithProps;

        /**
         * Add <meta-data android:name="com.google.android.gms.wallet.api.enabled" android:value="true" />
         * to AndroidManifest.xml
         */
        addMetaDataItemToMainApplication(
            mainApplication,
            META_NAME,
            'true'
        );

        /**
         * <activity android:name="com.reactnativecloudpayments.ThreeDSecureActivity" />
         */
        mainApplication.activity?.push({
            $: {
              "android:name": "com.reactnativecloudpayments.ThreeDSecureActivity",
            },
          });

        return configWithProps;
    });
}

const modifyApplicationGradle: ConfigPlugin<PluginProps> = (config, props) => {
    return withAppBuildGradle(config, (configWithProps) => {
        const yandexClientId = props?.yandexClientId || props.android?.yandexClientId || ''
        const sdkTag = props?.android?.sdk || ANDROID_SDK_VERSION;

        let mergeApplicationGradle = mergeContents({
            tag: 'add-yandex-client-id',
            src: configWithProps.modResults.contents,
            anchor: /defaultConfig(?:\s+)?\{/,
            newSrc: `        manifestPlaceholders = [YANDEX_CLIENT_ID: "${yandexClientId}"]`,
            offset: 2,
            comment: '//'
        })

        mergeApplicationGradle = mergeContents({
            tag: 'add-implementation',
            src: mergeApplicationGradle.contents,
            anchor: /dependencies(?:\s+)?\{/,
            newSrc: `    implementation 'com.github.cloudpayments:CloudPayments-SDK-Android:${sdkTag}'`,
            offset: 3,
            comment: '//'
        })


        configWithProps.modResults.contents = mergeApplicationGradle.contents;

        return configWithProps;
    })
}

const modifyBuildGradle: ConfigPlugin<PluginProps> = (config, props) => {
    return withProjectBuildGradle(config, (configWithProps) => {
        const src = configWithProps.modResults.contents;

        if (src.indexOf('jitpack.io')) {
            return configWithProps;
        }

        const mergedBuildGradle= mergeContents({
            tag: 'add-jitpack-repositories',
            src: configWithProps.modResults.contents,
            anchor: /allprojects(?:\s+)?\{/,
            newSrc: `        maven { url 'https://www.jitpack.io' }`,
            offset: 2,
            comment: '//'
        })

        configWithProps.modResults.contents = mergedBuildGradle.contents;

        return configWithProps;

    });
};

const androidPlugin: ConfigPlugin<PluginProps> = (config, props={}) => {
    modifyAndroidManifest(config, props);
    modifyApplicationGradle(config, props);
    modifyBuildGradle(config, props);

    return config;
}

export default androidPlugin;

