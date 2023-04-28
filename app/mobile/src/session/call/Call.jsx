import { useWindowDimensions, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Logo } from 'utils/Logo';
import Colors from 'constants/Colors';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { RTCView } from 'react-native-webrtc';
import { useCall } from './useCall.hook';
import { styles } from './Call.styled';

export function Call() {
  const {height, width} = useWindowDimensions();
  const [callWidth, setCallWidth] = useState(0);
  const [callHeight, setCallHeight] = useState(0);
  const { state, actions } = useCall();

  useEffect(() => {
    if (width > height) {
      setCallWidth((height * 9)/10);
      setCallHeight((height * 9)/10);
    }
    else {
      setCallWidth((width * 9)/10);
      setCallHeight((width * 9)/10);
    }
  }, [width, height]);

  useKeepAwake();

  return (
    <View style={styles.callBase}>
      <View style={{ ...styles.callFrame, width: callWidth, height: callHeight }}>
        { state.remoteStream && (
          <RTCView
            style={styles.callRemote}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.remoteStream.toURL()}
            zOrder={1}
          />
        )}
        { !state.remoteVideo && (
          <View style={styles.callLogo}>
            <Logo src={state.callLogo} width={callWidth} height={callHeight} radius={4} />
          </View>
        )}
        { state.localStream && (
          <RTCView
            style={styles.callLocal}
            mirror={true}
            objectFit={'contain'}
            streamURL={state.localStream.toURL()}
            zOrder={2}
          />
        )}
        <View style={styles.callOptions}>
          { state.localVideo && (
            <TouchableOpacity style={styles.callOption} onPress={actions.disableVideo}>
              <MatIcons name={'video-outline'} size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          { !state.localVideo && (
            <TouchableOpacity style={styles.callOption} onPress={actions.enableVideo}>
              <MatIcons name={'video-off-outline'} size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          { state.localAudio && (
            <TouchableOpacity style={styles.callOption} onPress={actions.disableAudio}>
              <MatIcons name={'microphone'} size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          { !state.localAudio && (
            <TouchableOpacity style={styles.callOption} onPress={actions.enableAudio}>
              <MatIcons name={'microphone-off'} size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.callEnd} onPress={actions.end}>
          <MatIcons name={'phone-hangup'} size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
