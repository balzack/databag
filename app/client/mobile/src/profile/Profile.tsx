import React from 'react';
import { IconButton } from 'react-native-paper';
import { SafeAreaView, View } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';

export type ContactParams = {
  guid: string;
  handle?: string;
  node?: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  cardId?: string;
  status?: string;
  offsync?: boolean;
}

export function Profile({ close }) {
  return (
    <View style={styles.profile}>
      <SafeAreaView style={styles.header}>
        { close && (
          <IconButton style={styles.close} compact="true"  mode="contained" icon="arrow-left" size={24} onPress={close} />
        )}
      </SafeAreaView>
    </View>
  )
}
