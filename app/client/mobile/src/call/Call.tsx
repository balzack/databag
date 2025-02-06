import React, { useEffect, useState } from 'react';
import { useWindowDimensions, Dimensions, Image, View } from 'react-native';
import { useCall } from './useCall.hook';
import { styles } from './Call.styled'
import { Card as Contact } from '../card/Card';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { Confirm } from '../confirm/Confirm';
import { Colors } from '../constants/Colors';
import { RTCView } from 'react-native-webrtc';

export function Call() {
  const { state, actions } = useCall();
  const [alert, setAlert] = useState(false);
  const [ending, setEnding] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [applyingVideo, setApplyingVideo] = useState(false);
  const [accepting, setAccepting] = useState(null as null|string);
  const [ignoring, setIgnoring] = useState(null as null|string);
  const [declining, setDeclining] = useState(null as null|string);
  const {height, width} = useWindowDimensions();

  const toggleAudio = async () => {
    if (!applyingAudio) {
      setApplyingAudio(true);
      try {
        if (state.audioEnabled) {
          await actions.disableAudio();
        } else if (!state.audioEnabled) {
          await actions.enableAudio();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setApplyingAudio(false);
    }
  }

  const toggleVideo = async () => {
    if (!applyingVideo) {
      setApplyingVideo(true);
      try {
        if (state.videoEnabled) {
          await actions.disableVideo();
        } else if (!state.videoEnabled) {
          await actions.enableVideo();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setApplyingVideo(false);
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

  const showName = (state.height - (8 * state.width / 10)) > 256;

  return (
    <View style={(state.calling && state.fullscreen) ? styles.active : styles.inactive}>
      { state.calling && (
        <Surface elevation={4} mode="flat" style={styles.call}>

          { !state.remoteVideo && !state.localVideo && showName && (
            <View style={styles.titleView}>
              { state.calling.name && (
                <Text style={styles.titleName} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.calling.name }</Text>
              )}
              { !state.calling.name && (
                <Text style={styles.titleName} adjustsFontSizeToFit={true} numberOfLines={1}>{ `${state.calling.handle}/${state.calling.node}` }</Text>
              )}
              <Image
                style={styles.titleImage}
                resizeMode="contain"
                source={{ uri: state.calling.imageUrl }}
              />
              <Text style={styles.duration}>{ `${Math.floor(state.duration/60)}:${(state.duration % 60).toString().padStart(2, '0')}` }</Text>
            </View>
          )}

          { !state.remoteVideo && !state.localVideo && !showName && (
            <Image
              style={styles.logoView}
              resizeMode="contain"
              source={{ uri: state.calling.imageUrl }}
            />
          )}

          { state.remoteVideo && (
            <RTCView
              style={styles.full}
              mirror={true}
              objectFit={'contain'}
              streamURL={state.remoteStream.toURL()}
            />
          )}

          { state.localVideo && (
            <RTCView
              style={state.remoteVideo ? styles.box : styles.full}
              mirror={true}
              objectFit={'contain'}
              streamURL={state.localStream.toURL()}
              zOrder={2}
            />
          )}

          <Surface elevation={3} mode="flat" style={styles.controls}>
            <IconButton style={styles.closeIcon} iconColor="white" disabled={!state.connected} icon="arrow-collapse-all" loading={applyingAudio} compact="true" mode="contained" size={32} onPress={()=>actions.setFullscreen(false)} />
            <IconButton style={styles.closeIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.primary} icon={state.audioEnabled ? 'microphone' : 'microphone-off'} loading={applyingAudio} compact="true" mode="contained" size={32} onPress={toggleAudio} />
            <IconButton style={styles.closeIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.primary} icon={state.videoEnabled ? 'video-outline' : 'video-off-outline'} loading={applyingVideo} compact="true" mode="contained" size={32} onPress={toggleVideo} />
            <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.danger} icon="phone-hangup-outline" compact="true" mode="contained" size={32} onPress={end} />
          </Surface>
        </Surface>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

