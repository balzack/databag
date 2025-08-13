import React, {useEffect, useState} from 'react';
import {Animated, useAnimatedValue, View, Platform} from 'react-native';
import {useRing} from './useRing.hook';
import {styles} from './Ring.styled';
import {useTheme, Text, Surface, IconButton, ActivityIndicator} from 'react-native-paper';
import {Confirm} from '../confirm/Confirm';
import {Colors} from '../constants/Colors';

const ACCEPT_DELAY_MS = 100;

export function Ring() {
  const {state, actions} = useRing();
  const [alert, setAlert] = useState(false);
  const [ending, setEnding] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [accepting, setAccepting] = useState(null as null | string);
  const [ignoring, setIgnoring] = useState(null as null | string);
  const [declining, setDeclining] = useState(null as null | string);
  const scale = useAnimatedValue(0);
  const theme = useTheme();

  useEffect(() => {
    if (accepting || state.calling || state.calls.length > 0) {
      Animated.timing(scale, {
        toValue: 80,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

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
  };

  const accept = async (callId, card) => {
    if (!accepting) {
      setAccepting(callId);
      try {
        await actions.accept(callId, card);
        await new Promise(r => setTimeout(r, ACCEPT_DELAY_MS));
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setAccepting(null);
    }
  };

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
  };

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
  };

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

  const sizeStyle = {marginBottom: 8, width: '100%', height: scale};
  const borderStyle = Platform.isPad ? {...styles.ring, borderRadius: 16} : {...styles.ring, borderRadius: 0};

  return (
    <Animated.View style={sizeStyle}>
      <View style={accepting || state.calling || state.calls.length > 0 ? styles.active : styles.inactive}>
        {state.calls.length > 0 && !accepting && !state.calling && (
          <Surface elevation={10} mode="flat" style={borderStyle}>
            <View style={styles.name}>
              <Text style={styles.nameSet} numberOfLines={1}>
                {state.calls[0].card.name ? state.calls[0].card.name : state.calls[0].card.node ? `${state.calls[0].card.handle}@${state.calls[0].card.node}` : state.calls[0].card.handle }
              </Text>
              <View style={styles.status}>
                {state.connected && <Text style={styles.duration}>{`${Math.floor(state.duration / 60)}:${(state.duration % 60).toString().padStart(2, '0')}`}</Text>}
                {!state.connected && (
                  <Text style={styles.duration} color="white">
                    0:00
                  </Text>
                )}
              </View>
            </View>

            <IconButton
              style={styles.clearIcon}
              iconColor="white"
              icon="bell-slash"
              size={28}
              loading={ignoring === state.calls[0].callId}
              onPress={() => ignore(state.calls[0].callId, state.calls[0].card)}
            />
            <IconButton
              style={styles.flipIcon}
              iconColor="white"
              containerColor={Colors.offsync}
              icon="phone"
              size={28}
              loading={declining === state.calls[0].callId}
              onPress={() => decline(state.calls[0].callId, state.calls[0].card)}
            />
            <IconButton
              style={styles.circleIcon}
              iconColor="white"
              containerColor={theme.colors.connected}
              icon="phone"
              size={28}
              loading={accepting === state.calls[0].callId}
              onPress={() => accept(state.calls[0].callId, state.calls[0].card)}
            />
          </Surface>
        )}
        {accepting && !state.calling && (
          <Surface elevation={10} mode="flat" style={styles.ring}>
            <ActivityIndicator size={32} />
          </Surface>
        )}
        {state.calling && (
          <Surface elevation={10} mode="flat" style={borderStyle}>
            <View style={styles.name}>
              <Text style={styles.nameSet} numberOfLines={1}>
                {state.calling.name ? state.calling.name : `${state.calling.handle}@${state.calling.node}`}
              </Text>
              <View style={styles.status}>
                {state.connected && <Text style={styles.duration}>{`${Math.floor(state.duration / 60)}:${(state.duration % 60).toString().padStart(2, '0')}`}</Text>}
                {!state.connected && (
                  <Text style={{...styles.ringing, color: theme.colors.onSurfaceDisabled}} color="white">
                    0:00
                  </Text>
                )}
              </View>
            </View>
            <IconButton style={styles.clearIcon} iconColor="white" disabled={!state.connected} icon={state.audioEnabled ? 'microphone' : 'microphone-slash'} size={28} onPress={toggleAudio} />
            <IconButton
              style={styles.clearIcon}
              iconColor="white"
              disabled={!state.connected}
              icon={state.remoteVideo || state.localVideo ? 'video-switch-outline' : 'frame-corners'}
              size={28}
              onPress={() => actions.setFullscreen(true)}
            />

            <View style={styles.end}>
              <IconButton style={styles.circleIcon} iconColor="white" containerColor={Colors.offsync} icon="phone" mode="contained" size={28} onPress={end} />
            </View>
          </Surface>
        )}
        <Confirm show={alert} params={alertParams} />
      </View>
    </Animated.View>
  );
}
