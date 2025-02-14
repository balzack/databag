import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './Setup.styled';

export function Setup() {
  return (
    <View style={styles.setup}>
      <View style={styles.header}>
        <Text>SETUP</Text>
      </View>
    </View>
  );
}

