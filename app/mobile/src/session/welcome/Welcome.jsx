import { useEffect } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Welcome.styled';

import session from 'images/session.png';

export function Welcome() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome to Databag</Text>
      <Text style={styles.label}>Communication for the decentralized web</Text>
      <Image style={styles.image} source={session} />
      <Text style={styles.message}>Step 1: setup your profile</Text>
      <Text style={styles.message}>Step 2: connect with people</Text>
      <Text style={styles.message}>Step 3: start a conversation topic</Text>
    </SafeAreaView>
  );
}

