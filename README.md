# react-native-cloudpayments-config-plugin

Plugin for automatic setup [react-native-cloudpayments-sdk](https://www.npmjs.com/package/react-native-cloudpayments-sdk) to your [expo](https://docs.expo.io/) application.

## Installation

Add the package to your project

```sh
npx expo install react-native-cloudpayments-config-plugin react-native-cloudpayments-sdk
```


After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["react-native-cloudpayments-config-plugin"]
  }
}
```

## API

- `yandexClientId` - used for Yandex Pay. Check [this guide](https://github.com/cloudpayments/CloudPayments-SDK-Android#дополнительные-шаги-для-использования-yandex-pay) for retrieve id from yandex.
- `ios.sdk` - version [CloudPayments-SDK-iOS](https://github.com/cloudpayments/CloudPayments-SDK-iOS/releases)
- `android.sdk` - version [CloudPayments-SDK-Android](https://github.com/cloudpayments/CloudPayments-SDK-Android/releases)

### Example

```json
{
    "expo": {
        ...,
        "plugins": [
            ...,
            [
                "react-native-cloudpayments-config-plugin",
                {
                    "yandexClientId": "MY_COOL_TOKEN",
                    "ios": {
                        "sdk": "1.1.9"
                    },
                    "android": {
                        "sdk": "1.2.7"
                    }
                }
            ]
        ]
    }
}
```