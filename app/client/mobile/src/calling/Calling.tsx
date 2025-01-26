import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image'

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();
  const [alert, setAlert] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const call = async (cardId: string) => {
    if (!connecting) {
      setConnecting(true);
      try {
        await actions.call(cardId);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setConnecting(false);
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
    <View style={(connecting || state.calling || state.ringing.length > 0 || alert) ? styles.active : styles.inactive}>
      <BlurView style={styles.blur} blurType="dark" blurAmount={9} reducedTransparencyFallbackColor="dark" />
      { connecting && !state.calling && (
        <ActivityIndicator size={72} />
      )}
      { state.calling && (
        <View style={styles.frame}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: state.calling.imageUrl }}
          />
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

