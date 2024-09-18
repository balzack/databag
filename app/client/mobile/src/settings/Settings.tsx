import React, {useContext} from 'react';
import {Button, Text} from 'react-native-paper';
import {SafeAreaView, View, Image} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';

export function Settings() {
  const { state, actions } = useSettings();

console.log("HERE");

  return (
    <SafeAreaView style={styles.settings}>
      <Text style={styles.header}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
      <View style={styles.image}>
        <Image style={styles.logo} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
        <View style={styles.editBar}>
          <Button style={styles.editLogo} mode="text">{state.strings.edit}</Button>
        </View>
      </View>


      <Button mode="contained" onPress={actions.logout}>
        Logout
      </Button>
    </SafeAreaView>
  );
}
