import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {styles} from './Setup.styled';
import {useSetup} from './useSetup.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function Setup() {
  const { state, actions } = useSetup();

  return (
    <View style={styles.setup}>
      <View style={styles.header}>
        <Text style={styles.title}>{ state.strings.setup }</Text>
      </View>
      <Divider style={styles.line} bold={true} />
      <KeyboardAwareScrollView enableOnAndroid={true} style={styles.form} contentContainerStyle={styles.content}>
        <Text>CONTENT</Text>
      </KeyboardAwareScrollView>
      <Divider style={styles.line} bold={true} />
    </View>
  );
}

