import pkg from './package.json'

export default {
  'expo': {
    'name': 'Delivery Maps',
    'slug': 'map-delivery',
    'version': '1.0.0',
    'orientation': 'portrait',
    'icon': './assets/images/icon.png',
    'scheme': 'ipdev-mapdelivery',
    'ios': {
      'icon': './assets/map.icon',
      buildNumber: String(pkg.buildNumber),
      bundleIdentifier: 'com.ipdev.mapdelivery'
    },
    'android': {
      'adaptiveIcon': {
        'backgroundColor': '#E6F4FE',
        'foregroundImage': './assets/images/android-icon-foreground.png',
        'backgroundImage': './assets/images/android-icon-background.png',
        'monochromeImage': './assets/images/android-icon-monochrome.png'
      },
      'predictiveBackGestureEnabled': false,
      versionCode: pkg.buildNumber,
      package: 'com.ipdev.mapdelivery',
    },
    'plugins': [
      'expo-router',
      [
        'expo-splash-screen',
        {
          'backgroundColor': '#208AEF',
          'image': './assets/images/splash-icon.png',
          'imageWidth': 120,
          'ios': {
            'image': './assets/images/splash-icon.png',
            'imageWidth': 120,
            'resizeMode': 'contain'
          },
          'android': {
            'image': './assets/images/splash-icon.png',
            'imageWidth': 76,
            'resizeMode': 'contain'
          }
        }
      ]
    ],
    'experiments': {
      'typedRoutes': true,
      'reactCompiler': true
    },
    'extra': {
      'router': {},
      'eas': {
        'projectId': '336144c6-da37-4f6a-a451-12bc8bf48577'
      }
    }
  }
}
