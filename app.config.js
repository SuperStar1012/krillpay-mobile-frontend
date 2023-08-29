const merge = require('deepmerge');
const common_config = require('./common.app.json');
const versionConfig = require('./version.json');

module.exports = () => {
  const config = {
    expo: {
      name: process.env.appName,
      description: process.env.appDescription,
      slug: process.env.appSlug,
      owner: 'iquita2005',
      primaryColor: process.env.appPrimaryColor,
      backgroundColor: process.env.appBackgroundColor,
      version: versionConfig.version,
      ios: {
        bundleIdentifier: 'com.app.krillpay',
        buildNumber: versionConfig.ios.buildNumber,
      },
      android: {
        package: 'com.app.krillpay',
      },
      extra: {
        eas: {
          projectId: '4f8dee02-8f7b-48b1-b0cb-10cdd7f28603',
          appVersion: versionConfig.version,
          sentryDSN:
            'https://ee8832433eb7490fbaf4e7fa64d88980@o4504651039768576.ingest.sentry.io/4504651125161984',
        },
      },
      updates: {
        url: process.env.appUpdatesUrl,
      },
      hooks: {
        postPublish: [
          {
            file: 'sentry-expo/upload-sourcemaps',
            config: {
              organization: 'KrillPay',
              project: 'krill-pay',
              authToken:
                '30c76618091a40f998c292ca88f50044e6151b3729e042858fb9bd284a919537',
            },
          },
        ],
      },
    },
    plugins: ['expo-localization'],
  };
  return merge(common_config, config);
};
