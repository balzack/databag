import { Text, Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import { useAudioAsset } from './useAudioAsset.hook';
import { styles } from './AudioAsset.styled';
import audio from 'images/audio.png';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

export function AudioAsset({ topicId, asset, active, setActive, dismiss }) {

  const { state, actions } = useAudioAsset(topicId, asset);

  const play = () => {
    actions.play();
    setActive();
  }

  return (
    <View style={styles.background}>
      <Image source={audio} style={{ width: state.length, height: state.length }} resizeMode={'cover'} />
      <Text style={styles.label}>{ asset.label }</Text>
      { state.playing && active && (
        <TouchableOpacity style={styles.control} onPress={actions.pause}>
          <Icons name="stop-circle-outline" size={92} color={Colors.white} />
        </TouchableOpacity>
      )}
      { (!state.playing || !active) && (
        <TouchableOpacity style={styles.control} onPress={play}>
          <Icons name="play-circle-outline" size={92} color={Colors.white} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.close} onPress={dismiss}>
        <Icons name="close" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}
  
