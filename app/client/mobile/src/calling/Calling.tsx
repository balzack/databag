import React, { useEffect, useState } from 'react';
import { useWindowDimensions, Image, SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../constants/Colors';

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();
  const [alert, setAlert] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ending, setEnding] = useState(false);
  const {height, width} = useWindowDimensions();

  const end = async () => {
    if (!ending) {
      setEnding(true);
      try {
        await actions.end();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setEnding(false);
    }
  }

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

  const overlap = (width + 128) > height;
  const frameWidth = width > height ? height : width - 16;
  const frameHeight = frameWidth;
  //const frameHeight = overlap ? frameWidth : frameWidth + 128;
  return (
    <View style={(connecting || state.calling || state.ringing.length > 0 || alert) ? styles.active : styles.inactive}>
      <BlurView style={styles.blur} blurType="dark" blurAmount={9} reducedTransparencyFallbackColor="dark" />
      { connecting && !state.calling && (
        <ActivityIndicator size={72} />
      )}
      { state.calling && (
        <Surface style={{ ...styles.frame, width: frameWidth, height: frameHeight }}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: state.calling.imageUrl }}
            onLayout={actions.loaded}
          />
          { state.loaded && (
            <LinearGradient style={{...styles.overlap, height: frameHeight / 2, top: 2, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 0, y: 0.5}} colors={['rgba(64,64,64,1)', 'rgba(64,64,64, 0)']}>
            <LinearGradient style={{...styles.overlap, height: frameHeight / 2, top: 2, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 0, y: 0.5}} colors={['rgba(64,64,64,1)', 'rgba(64,64,64, 0)']}>
            </LinearGradient>
            </LinearGradient>
          )}
          { state.loaded && (
            <LinearGradient style={{...styles.overlap, height: frameHeight / 2, bottom: 2, borderRadius: 8}} start={{x: 0, y: 0.5}} end={{x: 0, y: 1}} colors={['rgba(64,64,64,0)', 'rgba(64,64,64, 1)']}>
            <LinearGradient style={{...styles.overlap, height: frameHeight / 2, bottom: 2, borderRadius: 8}} start={{x: 0, y: 0.5}} end={{x: 0, y: 1}} colors={['rgba(64,64,64,0)', 'rgba(64,64,64, 1)']}>
            </LinearGradient>
            </LinearGradient>
          )}
          { state.loaded && (
            <View style={{ ...styles.overlap, top: 0 }}> 
              { state.calling.name && (
                <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.calling.name }</Text>
              )}
              { !state.calling.name && (
                <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ `${state.calling.handle}/${state.calling.node}` }</Text>
              )}
            </View>
          )}
          { state.loaded && (
            <View style={{ ...styles.overlap, bottom: 0 }}>
              <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon="microphone" compact="true" mode="contained" size={32} onPress={end} />
              <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon="video-outline"  compact="true" mode="contained" size={32} onPress={end} />
              <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.danger} icon="phone-hangup-outline" compact="true" mode="contained" size={32} onPress={end} />
            </View>
          )}
        </Surface>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

