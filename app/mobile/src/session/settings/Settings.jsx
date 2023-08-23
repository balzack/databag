import { ScrollView, View, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Settings.styled';
import { useSettings } from './useSettings.hook';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import Strings from 'constants/Strings';

export function Settings() {

  const { state, actions } = useSettings();

  return (
    <SafeAreaView edges={['left', 'right', 'top', 'bottom']} style={styles.container}>
      <ScrollView style={styles.content}>

        <Text style={styles.label}>Settings</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="bell-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ Strings[state.lang].enableNotifications }</Text>
            </View>
            <View style={styles.control}>
              <Switch style={styles.notifications} trackColor={styles.track}/>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.entry}>
            <View style={styles.icon}>
              <MatIcons name="lock-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ Strings[state.lang].sealedTopics }</Text>
            </View>
            <View style={styles.control} />
          </View>
        </View>

        <Text style={styles.label}>Display</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="progress-clock" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ Strings[state.lang].hourMode }</Text>
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry}>
            <View style={styles.icon}>
              <MatIcons name="earth" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ Strings[state.lang].language }</Text>
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
