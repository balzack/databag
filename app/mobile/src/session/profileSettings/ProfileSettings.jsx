import { ScrollView, View } from 'react-native';
import { Profile } from '../profile/Profile';
import { Settings } from '../settings/Settings';
import { styles } from './ProfileSettings.styled';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export function ProfileSettings() {

  return (
    <ScrollView style={styles.drawer}>
      <SafeAreaView style={styles.container} edges={['top', 'right']}>
        <Profile drawer={true} />
        <Settings drawer={true} />
      </SafeAreaView>
    </ScrollView>
  );
}

