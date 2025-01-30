import React, { useEffect, useState } from 'react';
import { useWindowDimensions, Image, SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput, useTheme} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../constants/Colors';
import { RTCView } from 'react-native-webrtc';
import { Card } from '../card/Card';
import { activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";

export function Calling({ callCard }: { callCard: string }) {
  const { state, actions } = useCalling();
  const [alert, setAlert] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ending, setEnding] = useState(false);
  const {height, width} = useWindowDimensions();
  const [applyingVideo, setApplyingVideo] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [accepting, setAccepting] = useState(null as null|string);
  const [ignoring, setIgnoring] = useState(null as null|string);
  const [declining, setDeclining] = useState(null as null|string);
  const theme = useTheme();

  const surface = theme.dark ? {
    base: 'rgba(16,16,16,1)',
    blend: 'rgba(16,16,16,0)',
    control: 'rgba(64,64,64,0.6)',
    title: 'rgba(32,32,32,0.8)',
  } : {
    base: 'rgba(212,212,212,1)',
    blend: 'rgba(212,212,212,0)',
    control: 'rgba(128,128,128,0.6)',
    title: 'rgba(192,192,192,0.8)',
  };

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

  const accept = async (callId, card) => {
    if (!accepting) {
      setAccepting(callId);
      try {
        await actions.accept(callId, card);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setAccepting(null);
    }
  }

  const ignore = async (callId, card) => {
    if (!ignoring) {
      setIgnoring(callId);
      try {
        await actions.ignore(callId, card);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setIgnoring(null);
    }
  }

  const decline = async (callId, card) => {
    if (!declining) {
      setDeclining(callId);
      try {
        await actions.decline(callId, card);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setDeclining(null);
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

  useEffect(() => {
    if (state.calling) {
      activateKeepAwake();
    } else {
      deactivateKeepAwake();
    }
  }, [state.calling]);

  const calls = state.calls.map((contact, index) => {
    const { callId, card } = contact;
    const { name, handle, node, imageUrl } = card;
    const ignoreButton = <IconButton key="ignore" style={styles.circleIcon} iconColor="white" containerColor={Colors.pending} icon="eye-off-outline" compact="true" mode="contained" size={24} loading={ignoring===callId} onPress={()=>ignore(callId, card)} />
    const declineButton = <IconButton key="decline" style={styles.flipIcon} iconColor="white" containerColor={Colors.offsync} icon="phone-outline" compact="true" mode="contained" size={24} loading={declining===callId} onPress={()=>decline(callId, card)} />
    const acceptButton = <IconButton key="accept" style={styles.circleIcon} iconColor="white" containerColor={Colors.primary} icon="phone-outline" compact="true" mode="contained" size={24} loading={accepting===callId} onPress={()=>accept(callId, card)} />
    return (
      <Surface mode="flat" key={index}>
        <Card containerStyle={styles.card} placeholder={''} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
      </Surface>
    )
  });

  const overlap = (width + 128) > height;
  const frameWidth = width > height ? height : width - 16;
  const frameHeight = frameWidth;
  const frameOffset = (height - frameHeight) / 3;
  return (
    <View style={(connecting || state.calling || state.calls.length > 0 || alert) ? styles.active : styles.inactive}>
      { state.calls.length > 0 && !connecting && !state.calling && (
        <View style={styles.base}>
          <BlurView style={styles.blur} />
          <View style={styles.calls}>
            { calls }
          </View>
        </View>
      )}
      { connecting && !state.calling && (
        <View style={{ ...styles.container, backgroundColor: surface.base }}>
          <ActivityIndicator size={72} />
        </View>
      )}
      { state.calling && (
        <View style={{ ...styles.container, backgroundColor: surface.base }}>
          <View style={{ ...styles.frame, top: frameOffset, width: frameWidth > 400 ? 400 : frameWidth, height: frameHeight > 400 ? 400 : frameHeight }}>
            <Image
              style={{ ...styles.image, opacity: state.loaded ? 1 : 0 }}
              resizeMode="contain"
              source={{ uri: state.calling.imageUrl }}
              onLayout={actions.loaded}
            />
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, width: '100%', height: 16, top: 0, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={[surface.base, surface.blend]} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, width: '100%', height: 16, bottom: 0, borderRadius: 8}} start={{x: 0, y: 0.2}} end={{x: 0, y: 1}} colors={[surface.blend, surface.base]} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, height: '100%', width: 16, right: 0}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[surface.blend, surface.base]} />
            )}
            { state.loaded && (
              <LinearGradient style={{...styles.overlap, height: '100%', width: 16, left: 0}} start={{x: 1, y: 0}} end={{x: 0, y: 0}} colors={[surface.blend, surface.base]} />
            )}
          </View>
        </View>
      )}
      { state.calling && state.loaded && (
        <View style={{ ...styles.overlap, top: 64 }}>
          <View style={{backgroundColor: surface.title, borderRadius: 4 }}> 
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
        <View style={{ ...styles.canvas, backgroundColor: surface.base }}>
        <RTCView
          style={styles.full}
          mirror={true}
          objectFit={'contain'}
          streamURL={state.remote.toURL()}
        />
        </View>
      )}
      { state.calling && state.loaded && state.local && !state.remote && (
        <View style={{ ...styles.canvas, backgroundColor: surface.base }}>
        <RTCView
          style={styles.full}
          mirror={true}
          objectFit={'contain'}
          streamURL={state.local.toURL()}
        />
        </View>
      )}
      { state.calling && state.loaded && state.local && state.remote && (
        <RTCView
          style={{ ...styles.box, top: frameOffset }}
          mirror={true}
          objectFit={'contain'}
          streamURL={state.local.toURL()}
          zOrder={2}
        />
      )}
      { state.calling && state.loaded && (
        <View style={{ ...styles.overlap, bottom: frameOffset }}>
          <View style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16, gap: 16, display: 'flex', flexDirection: 'row', borderRadius: 16, backgroundColor: surface.control }}>
          <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon={state.audioEnabled ? 'microphone' : 'microphone-off'} loading={applyingAudio} disabled={!state.audio} compact="true" mode="contained" size={32} onPress={toggleAudio} />
          <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.primary} icon={state.videoEnabled ? 'video-outline' : 'video-off-outline'} loading={applyingVideo} disabled={!state.video} compact="true" mode="contained" size={32} onPress={toggleVideo} />
          <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.danger} icon="phone-hangup-outline" compact="true" mode="contained" size={32} onPress={end} />
          </View>
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

