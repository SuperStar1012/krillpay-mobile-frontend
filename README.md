# wallet-react-native

## Prerequisites

- NodeJs (nvm also recommended for switching versions)
- Node version: v16.14.2
- Expo-cli version: 6.1.0

## Getting started

- fork the repository
- git clone `https://github.com/{{username}}/wallet-react-native.git`
- go to `wallet-react-native` directory
- Switch to a compatable node version `nvm install v16.14.2` and `nvm use v16.14.2`
- run `yarn` to install the dependencies
- follow one of the following steps

\*\* _before this make sure port 19000 and 19001 is open in your operating system_

### Run using command line

- run `yarn global add expo-cli@6.1.0` to install exp globally
- run `expo start` to open the app in Expo on a connected device/emulator
- Instructions for seting up the emulators https://docs.expo.dev/workflow/ios-simulator/ and https://docs.expo.dev/workflow/android-studio-emulator/

### Creating the EAS secrets

`eas secret:create --name SENTRY_AUTH_TOKEN --scope=account --type=string --value=<auth key from sentry>`  
`eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json`

### Creating a build

Requires `direnv`. Unfortunately native build variables are managed via eas.json and expo variables are managed via normal environmental variables and so any updates need to be made both in the env variables and in eas.json.

Update the version in `version.json`, you'll need to bump the version number and android build number.

`cp .env.staging .env && direnv allow .`  
`eas build -e staging -p all --non-interactive`  
OR  
`cp .env.production .env && direnv allow .`  
`eas build -e production -p all --non-interactive`

### OTA updates

`eas update --branch v4.0.11 --message v4.0.11`
`eas channel:edit staging --branch v4.0.11`
OR
`eas update --branch v4.0.11 --message v4.0.11`
`eas channel:edit production --branch v4.0.11`
