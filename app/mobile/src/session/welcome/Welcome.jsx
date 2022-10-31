import { useEffect } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Welcome.styled';

import session from 'images/session.png';

export function Welcome() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Databag</Text>
      <Text style={styles.label}>Communication for the decentralized web</Text>
      <Image style={styles.image} source={session} />
    </SafeAreaView>
  );
}

