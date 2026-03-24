import pkg from './package.json'

export default {
  expo: {
    name: 'Delivery Maps',
    slug: 'map-delivery',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'ipdev-deliverymaps',
    ios: {
      icon: './assets/map.icon',
      buildNumber: String(pkg.buildNumber),
      googleServicesFile: './secrets/GoogleService-Info.plist',
      bundleIdentifier: 'com.ipdev.deliverymaps'
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png'
      },
      predictiveBackGestureEnabled: false,
      versionCode: pkg.buildNumber,
      googleServicesFile: './secrets/google-services.json',
      package: 'com.ipdev.deliverymaps'
    },
    plugins: [
      'expo-router',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            buildReactNativeFromSource: true
          }
        }
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          ios: {
            image: './assets/images/splash-icon.png',
            imageWidth: 120,
            resizeMode: 'contain'
          },
          android: {
            image: './assets/images/splash-icon.png',
            imageWidth: 76,
            resizeMode: 'contain'
          }
        }
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/auth'
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: '336144c6-da37-4f6a-a451-12bc8bf48577'
      }
    }
  }
}
