import { FlatList, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { useTopicItem } from './useTopicItem.hook';
import { styles } from './TopicItem.styled';
import { Logo } from 'utils/Logo';
import Colors from 'constants/Colors';
import { VideoThumb } from './videoThumb/VideoThumb';
import { AudioThumb } from './audioThumb/AudioThumb';
import { ImageThumb } from './imageThumb/ImageThumb';

export function TopicItem({ item }) {

  const { state, actions } = useTopicItem(item);

  const renderThumb = (asset) => {
    if (asset.item.image) {
      return <ImageThumb topicId={item.topicId} asset={asset.item.image} />
    }
    if (asset.item.video) {
      return <VideoThumb topicId={item.topicId} asset={asset.item.video} />
    }
    if (asset.item.audio) {
      return <AudioThumb topicId={item.topicId} asset={asset.item.audio} />
    }
    return <></>
  };

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Logo src={state.logo} width={28} height={28} radius={6} />
        <Text style={styles.name}>{ state.name }</Text>
        <Text style={styles.timestamp}>{ state.timestamp }</Text>
      </View>
      { state.status === 'confirmed' && (
        <>
          { state.transform === 'complete' && state.assets && (
            <FlatList style={styles.carousel}
              data={state.assets}
              horizontal={true}
              renderItem={renderThumb}
            />
          )}
          { state.transform === 'incomplete' && (
            <ActivityIndicator size="large" color={Colors.background} />
          )}
          { state.transform === 'error' && (
            <ActivityIndicator size="large" color={Colors.alert} />
          )}
          { state.message && (
            <Text style={styles.message}>{ state.message }</Text>
          )}
        </>
      )}
      { state.status !== 'confirmed' && (
        <ActivityIndicator size="large" color={Colors.divider} />
      )}
    </View>
  );
}

