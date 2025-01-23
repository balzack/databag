import React, { useEffect } from 'react';
import { SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();

  useEffect(() => {
    if (callCard.cardId) {
      actions.call(callCard.cardId);
    }
  }, [callCard]);

  return (
    <View style={(state.link || state.ringing.length > 0) ? styles.active : styles.inactive}>
      <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
    </View>
  );
}

