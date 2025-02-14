import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './Accounts.styled';

export function Accounts() {
  return (
    <View style={styles.accounts}>
      <View style={styles.header}>
        <Text>ACCOUNTS</Text>
      </View>
    </View>
  );
}

