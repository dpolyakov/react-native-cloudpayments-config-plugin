export type PluginProps = {
    yandexClientId?: string,
    ios?: {
        sdk?: string;
    },
    android?: {
        sdk?: string;
        yandexClientId?: string;
    }
}