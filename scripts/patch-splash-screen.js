const fs = require('fs');
const path = require('path');

const storyboardPath = path.join(
  __dirname, '../ios/DeliveryMaps/SplashScreen.storyboard'
);

let xml = fs.readFileSync(storyboardPath, 'utf8');

xml = xml.replace(
  '<subviews/>',
  `<subviews>
    <imageView
      clipsSubviews="YES"
      userInteractionEnabled="NO"
      contentMode="scaleAspectFit"
      horizontalHuggingPriority="251"
      verticalHuggingPriority="251"
      image="SplashScreenLogo"
      translatesAutoresizingMaskIntoConstraints="NO"
      id="EXPO-SplashScreen"/>
  </subviews>`
);

xml = xml.replace(
  '<constraints>',
  `<constraints>
    <constraint firstItem="EXPO-SplashScreen" firstAttribute="width" constant="120" id="splash-width-constraint"/>
    <constraint firstItem="EXPO-SplashScreen" firstAttribute="height" constant="120" id="splash-height-constraint"/>`
);

fs.writeFileSync(storyboardPath, xml);
console.log('Splash storyboard patched ✓');
