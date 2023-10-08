import { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Welcome.styled';
import { Colors } from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { getLanguageStrings } from 'constants/Strings';

import light from 'images/session.png';
import dark from 'images/darksess.png';

export function Welcome() {
  const [strings, setStrings] = useState(getLanguageStrings());

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Databag</Text>
      <Text style={styles.label}>{ strings.communication }</Text>
      { Colors.theme === 'dark' && (
        <Image style={styles.image} source={dark} />
      )}
      { Colors.theme !== 'dark' && (
        <Image style={styles.image} source={light} />
      )}
      <View style={styles.steps}>
        <Text style={styles.stepstext}>{ strings.setup }</Text>
        <Ionicons name={'right'} size={18} color={Colors.text} />
        <Text style={styles.stepstext}>{ strings.connect }</Text>
        <Ionicons name={'right'} size={18} color={Colors.text} />
        <Text style={styles.stepstext}>{ strings.start }</Text>
      </View>
    </SafeAreaView>
  );
}

