import React from 'react';
import { SafeAreaView, View } from 'react-native';
import {Divider, IconButton, Text} from 'react-native-paper';
import {styles} from './Details.styled';
import {useDetails} from './useDetails.hook';

export function Details({close, closeAll}: {close: ()=>void, closeAll: ()=>void}) {
  const { state, actions } = useDetails();

  return (
    <View style={styles.details}>
      <SafeAreaView style={styles.header}>
        {close && (
          <View style={styles.close}>
            <IconButton style={styles.closeIcon} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />
          </View>
        )}
        <Text style={styles.title}>{ state.strings.details }</Text>
        {close && (
          <View style={styles.close} />
        )} 
      </SafeAreaView>
      <Divider style={styles.divider} />
    </View>
  )
}
