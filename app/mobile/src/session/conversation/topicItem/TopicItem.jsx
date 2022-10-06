import { FlatList, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTopicItem } from './useTopicItem.hook';
import { styles } from './TopicItem.styled';
import { Logo } from 'utils/Logo';
import Colors from 'constants/Colors';
import { VideoThumb } from './videoThumb/VideoThumb';
import { AudioThumb } from './audioThumb/AudioThumb';
import { ImageThumb } from './imageThumb/ImageThumb';
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import AntIcons from '@expo/vector-icons/AntDesign';
import Carousel from 'react-native-snap-carousel';
import GestureRecognizer from 'react-native-swipe-gestures';

export function TopicItem({ item }) {

  const { state, actions } = useTopicItem(item);

  const renderAsset = (asset) => {
    return (
      <TouchableOpacity style={styles.frame} activeOpacity={1}>
        { asset.item.image && (
          <ImageAsset topicId={item.topicId} asset={asset.item.image} />
        )}
        { asset.item.video && (
          <VideoAsset topicId={item.topicId} asset={asset.item.video} />
        )}
        { asset.item.audio && (
          <AudioAsset topicId={item.topicId} asset={asset.item.audio} />
        )}
      </TouchableOpacity>
    )
  }

  const renderThumb = (thumb) => {
    return (
      <View>
        { thumb.item.image && (
          <ImageThumb topicId={item.topicId} asset={thumb.item.image} onAssetView={() => actions.showCarousel(thumb.index)} />
        )}
        { thumb.item.video && (
          <VideoThumb topicId={item.topicId} asset={thumb.item.video} onAssetView={() => actions.showCarousel(thumb.index)} />
        )}
        { thumb.item.audio && (
          <AudioThumb topicId={item.topicId} asset={thumb.item.audio} onAssetView={() => actions.showCarousel(thumb.index)} />
        )}
      </View>
    );
  }

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
            <AntIcons name="cloudo" size={32} color={Colors.background} />
          )}
          { state.transform === 'error' && (
            <AntIcons name="cloudo" size={32} color={Colors.alert} />
          )}
          { state.message && (
            <Text style={styles.message}>{ state.message }</Text>
          )}
        </>
      )}
      { state.status !== 'confirmed' && (
        <AntIcons name="cloudo" size={32} color={Colors.divider} />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.carousel}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideCarousel}
      >
        <View style={styles.modal}>
          <GestureRecognizer onSwipeUp={actions.hideCarousel} onSwipeDown={actions.hideCarousel}>
            <Carousel
              data={state.assets}
              firstItem={state.carouselIndex}
              renderItem={renderAsset}
              sliderWidth={state.width}
              itemWidth={state.width}
            />
          </GestureRecognizer>
        </View>
      </Modal> 
    </View>
  );
}

