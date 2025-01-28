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
import { RTCView } from 'react-native-webrtc';

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();
  const [alert, setAlert] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ending, setEnding] = useState(false);
  const {height, width} = useWindowDimensions();
  const [applyingVideo, setApplyingVideo] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);

  const toggleVideo = async () => {
    if (!applyingVideo) {
      setApplyingVideo(true);
      try {
        if (state.video && state.videoEnabled) {
          await actions.disableVideo();
        } else if (state.video && !state.videoEnabled) {
          await actions.enableVideo();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setApplyingVideo(false);
    }
  }

  const toggleAudio = async () => {
    if (!applyingAudio) {
      setApplyingAudio(true);
      try {
        if (state.audio && state.audioEnabled) {
          await actions.disableAudio();
        } else if (state.audio && !state.audioEnabled) {
          await actions.enableAudio();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setApplyingAudio(false);
    }
  }

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
  const frameOffset = (height - frameHeight) / 8;
  return (
    <SafeAreaView style={(connecting || state.calling || state.ringing.length > 0 || alert) ? styles.active : styles.inactive}>
      <View style={styles.container}>
        { connecting && !state.calling && (
          <ActivityIndicator size={72} />
        )}
        { state.calling && (
          <View style={{ ...styles.frame, top: frameOffset, width: frameWidth, height: frameHeight }}>
            <Image
              style={{ ...styles.image, opacity: state.loaded ? 1 : 0 }}
              resizeMode="contain"
              source={{ uri: state.calling.imageUrl }}
              onLayout={actions.loaded}
            />
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, width: '100%', height: 16, top: 0, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['rgba(64,64,64,1)', 'rgba(64,64,64, 0)']} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, width: '100%', height: 16, bottom: 0, borderRadius: 8}} start={{x: 0, y: 0.2}} end={{x: 0, y: 1}} colors={['rgba(64,64,64,0)', 'rgba(64,64,64, 1)']} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, height: '100%', width: 16, right: 0}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(64,64,64,0)', 'rgba(64,64,64, 1)']} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, height: '100%', width: 16, left: 0}} start={{x: 1, y: 0}} end={{x: 0, y: 0}} colors={['rgba(64,64,64,0)', 'rgba(64,64,64, 1)']} />
            )}
          </View>
        )}
        { state.calling && state.loaded && (
          <View style={{ ...styles.overlap, top: 16 }}>
            <View style={{backgroundColor: 'rgba(32,32,32,0.8', borderRadius: 4 }}> 
            { state.calling.name && (
              <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.calling.name }</Text>
            )}
            { !state.calling.name && (
              <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ `${state.calling.handle}/${state.calling.node}` }</Text>
            )}
            </View>
          </View>
        )}
        { state.calling && state.loaded && state.remote && (
          <RTCView
            style={styles.full}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.remote.toURL()}
            zOrder={2}
          />
        )}
        { state.calling && state.loaded && state.local && !state.remote && (
          <RTCView
            style={styles.full}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.local.toURL()}
            zOrder={2}
          />
        )}
        { state.calling && state.loaded && state.local && state.remote && (
          <RTCView
            style={styles.box}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.local.toURL()}
            zOrder={2}
          />
        )}
        { state.calling && state.loaded && (
          <View style={{ ...styles.overlap, bottom: frameOffset }}>
            <View style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16, gap: 16, display: 'flex', flexDirection: 'row', borderRadius: 16, backgroundColor: 'rgba(128,128,128,0.6)' }}>
            <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon={state.audioEnabled ? 'microphone' : 'microphone-off'} loading={applyingAudio} disabled={!state.audio} compact="true" mode="contained" size={32} onPress={toggleAudio} />
            <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon={state.videoEnabled ? 'video-outline' : 'video-off-outline'} loading={applyingVideo} disabled={!state.video} compact="true" mode="contained" size={32} onPress={toggleVideo} />
            <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.danger} icon="phone-hangup-outline" compact="true" mode="contained" size={32} onPress={end} />
            </View>
          </View>
        )}
      </View>
      <Confirm show={alert} params={alertParams} />
    </SafeAreaView>
  );
}

