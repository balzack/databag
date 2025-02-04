import React, { useEffect, useState } from 'react';
import { useWindowDimensions, Image, SafeAreaView, Modal, ScrollView, View } from 'react-native';
import { Surface, Icon, Divider, Button, IconButton, Text, TextInput, useTheme} from 'react-native-paper';
import {styles} from './Calling.styled';
import {useCalling} from './useCalling.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import { Colors } from '../constants/Colors';
import { type Card } from 'databag-client-sdk';
import { RTCView } from 'react-native-webrtc';
import { Card as Contact } from '../card/Card';
import { activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";

export function Calling({ callCard }: { callCard: null|Card }) {
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

  const call = async (card) => {
    if (!connecting) {
      setConnecting(true);
      try {
        await actions.call(card);
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
    const { card } = callCard;
    if (card) {
      call(card);
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
        <Contact containerStyle={styles.card} placeholder={''} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
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
              style={styles.image}
              resizeMode="contain"
              source={{ uri: state.calling.imageUrl }}
            />
          </View>
        </View>
      )}
      { state.calling && (
        <View style={{ ...styles.overlap, top: 64 }}>
          <View style={{backgroundColor: surface.title, borderRadius: 16 }}> 
          { state.calling.name && (
            <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.calling.name }</Text>
          )}
          { !state.calling.name && (
            <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{ `${state.calling.handle}/${state.calling.node}` }</Text>
          )}
          </View>
        </View>
      )}
      { state.calling && state.remoteStream && state.remoteVideo && (
        <View style={{ ...styles.canvas, backgroundColor: surface.base }}>
          <RTCView
            style={styles.full}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.remoteStream.toURL()}
          />
        </View>
      )}
      { state.calling && state.localStream && state.localVideo && (
        <View style={{ ...styles.canvas, backgroundColor: surface.base }}>
          <RTCView
            style={ state.remoteVideo ? styles.box : styles.full}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.localStream.toURL()}
            zOrder={2}
          />
        </View>
      )}
      { state.calling && (
        <View style={{ ...styles.overlap, bottom: 64 }}>
          <View style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16, gap: 16, display: 'flex', flexDirection: 'row', borderRadius: 16, backgroundColor: surface.control }}>
          <IconButton style={styles.closeIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.primary} icon={state.audioEnabled ? 'microphone' : 'microphone-off'} loading={applyingAudio} compact="true" mode="contained" size={32} onPress={toggleAudio} />
          <IconButton style={styles.closeIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.primary} icon={state.videoEnabled ? 'video-outline' : 'video-off-outline'} loading={applyingVideo} compact="true" mode="contained" size={32} onPress={toggleVideo} />
          <IconButton style={styles.closeIcon} iconColor="white" containerColor={Colors.danger} icon="phone-hangup-outline" compact="true" mode="contained" size={32} onPress={end} />
          </View>
        </View>
      )}
      { state.calling && !state.connected && (
        <View style={{ ...styles.overlap, bottom: 24 }}>
          <View style={{backgroundColor: surface.title, borderRadius: 16 }}> 
            <Text style={styles.connecting}>{ state.strings.connecting }</Text>
          </View>
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}

