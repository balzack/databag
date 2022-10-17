import { FlatList, View, Text, Modal, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
import MatIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';
import GestureRecognizer from 'react-native-swipe-gestures';
import avatar from 'images/avatar.png';

export function TopicItem({ item, focused, focus }) {

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
          <AudioAsset topicId={item.topicId} asset={asset.item.audio} active={state.activeId == asset.dataIndex}
              setActive={() => actions.setActive(asset.dataIndex)} />
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
    <TouchableOpacity activeOpacity={1} style={styles.item} onPress={focus}>
      <View style={styles.header}>
        { state.logo && (
          <Image source={{ uri: state.logo }} style={{ width: 28, height: 28, borderRadius: 6 }} />
        )}
        { !state.logo && (
          <Image source={avatar} style={{ width: 28, height: 28, borderRadius: 6 }} />
        )}
        <Text style={styles.name}>{ state.name }</Text>
        <Text style={styles.timestamp}>{ state.timestamp }</Text>
        { focused && (
          <View style={styles.focused}>
            <MatIcons name="cloud-braces" size={24} color={Colors.background} />
          </View>
        )}
      </View>
      { state.status === 'confirmed' && (
        <>
          { state.transform === 'complete' && state.assets && (
            <FlatList contentContainerStyle={styles.carousel}
               data={state.assets}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               renderItem={renderThumb}
             />
          )}
          { state.transform === 'incomplete' && (
            <View style={styles.status}>
              <MatIcons name="cloud-refresh" size={32} color={Colors.background} />
            </View>
          )}
          { state.transform === 'error' && (
            <View style={styles.status}>
              <AntIcons name="weather-cloudy-alert" size={32} color={Colors.alert} />
            </View>
          )}
          { state.message && (
            <Text style={{ paddingLeft: 52, fontSize: state.fontSize, color: state.fontColor }}>{ state.message }</Text>
          )}
        </>
      )}
      { state.status !== 'confirmed' && (
        <View style={styles.status}>
          <MatIcons name="cloud-refresh" size={32} color={Colors.divider} />
        </View>
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
    </TouchableOpacity>
  );
}

