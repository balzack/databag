import React, { useRef, useEffect, useState } from 'react';
import { Animated, useAnimatedValue, View } from 'react-native';
import { useRing } from './useRing.hook';
import { styles } from './Ring.styled'
import { Card as Contact } from '../card/Card';
import { Icon, Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { Confirm } from '../confirm/Confirm';
import { Colors } from '../constants/Colors';

const ACCEPT_DELAY_MS = 100;
const RING_ICON_MS = 500;

export function Ring() {
  const { state, actions } = useRing();
  const [alert, setAlert] = useState(false);
  const [ending, setEnding] = useState(false);
  const counting = useRef(0);
  const [counter, setCounter] = useState(0);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [accepting, setAccepting] = useState(null as null|string);
  const [ignoring, setIgnoring] = useState(null as null|string);
  const [declining, setDeclining] = useState(null as null|string);
  const scale = useAnimatedValue(0)

  useEffect(() => {
    const ringing = setInterval(() => {
      counting.current += 1;
      setCounter(counting.current);
    }, RING_ICON_MS);
    return () => clearInterval(ringing);
  }, []);

  useEffect(() => {
    if (accepting || state.calling || state.calls.length > 0) {
      Animated.timing(scale, {
        toValue: 64,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(scale, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [accepting, state.calling, state.calls]);

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

  const accept = async (callId, card) => {
    if (!accepting) {
      setAccepting(callId);
      try {
        await actions.accept(callId, card);
        await new Promise((r) => setTimeout(r, ACCEPT_DELAY_MS));
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

  const calls = state.calls.map((contact, index) => {
    const { callId, card } = contact;
    const { name, handle, node, imageUrl } = card;
    const ignoreButton = <IconButton key="ignore" style={styles.circleIcon} iconColor="white" containerColor={Colors.pending} icon="eye-off-outline" compact="true" mode="contained" size={24} loading={ignoring===callId} onPress={()=>ignore(callId, card)} />
    const declineButton = <IconButton key="decline" style={styles.flipIcon} iconColor="white" containerColor={Colors.offsync} icon="phone-outline" compact="true" mode="contained" size={24} loading={declining===callId} onPress={()=>decline(callId, card)} />
    const acceptButton = <IconButton key="accept" style={styles.circleIcon} iconColor="white" containerColor={Colors.primary} icon="phone-outline" compact="true" mode="contained" size={24} loading={accepting===callId} onPress={()=>accept(callId, card)} />
    return (
      <Contact containerStyle={styles.card} placeholder={state.strings.name} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
    )
  });

  return (
    <Animated.View style={{ width: '100%', height: scale }}>
      <View style={(accepting || state.calling || state.calls.length > 0) ? styles.active : styles.inactive}>
        { state.calls.length > 0 && !accepting && !state.calling && (
          <Surface elevation={4} mode="flat" style={{ ...styles.ring, borderRadius: state.layout === 'large' ? 16 : 0 }}>
            { calls[0] }
          </Surface>
        )}
        { accepting && !state.calling && (
          <Surface elevation={4} mode="flat" style={styles.ring}>
            <ActivityIndicator size={32} />
          </Surface>
        )}
        { state.calling && (
          <Surface elevation={4} mode="flat" style={{ ...styles.ring, borderRadius: state.layout === 'large' ? 16 : 0 }}>
            <IconButton style={styles.circleIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.primary} icon={state.audioEnabled ? 'microphone' : 'microphone-off'} compact="true" mode="contained" size={24} onPress={toggleAudio} />
            <IconButton style={styles.circleIcon} iconColor="white" disabled={!state.connected} containerColor={Colors.confirmed} icon={(state.remoteVideo || state.localVideo) ? 'video-switch-outline' : 'arrow-expand-all'} compact="true" mode="contained" size={24} onPress={()=>actions.setFullscreen(true)} />
            <View style={styles.name}>
              { state.calling.name && (
                <Text style={styles.nameSet} numberOfLines={1}>{ state.calling.name }</Text>
              )}
              { !state.calling.name && (
                <Text style={styles.nameUnset} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.strings.name }</Text>
              )}
            </View>
            <View style={styles.status}>
              { state.connected && (
                <Text style={styles.duration}>{ `${Math.floor(state.duration/60)}:${(state.duration % 60).toString().padStart(2, '0')}` }</Text>
              )}
              { !state.connected && (
                <View style={{ transform: [{ rotate: counter % 2 ? '15deg' : '-15deg' }] }}>
                  <Icon size={24} source="bell-outline" color={Colors.primary} />
                </View>
              )}
            </View>
            <View style={styles.end}>
              <IconButton style={styles.flipIcon} iconColor="white" containerColor={Colors.offsync} icon="phone-outline" compact="true" mode="contained" size={24} onPress={end} />
            </View>
          </Surface>
        )}
        <Confirm show={alert} params={alertParams} />
      </View>
    </Animated.View>
  );
}

