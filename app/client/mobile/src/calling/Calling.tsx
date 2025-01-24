import React, { useEffect, useState } from 'react';
import { SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();
  const [alert, setAlert] = useState(false);

  const call = async (cardId: string) => {
    try {
      await actions.call(cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
  }

  const alertParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  useEffect(() => {
    const { cardId } = callCard;
    if (cardId) {
      call(cardId);
    }
  }, [callCard]);

  return (
    <View style={(state.link || state.ringing.length > 0 || alert) ? styles.active : styles.inactive}>
      <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

