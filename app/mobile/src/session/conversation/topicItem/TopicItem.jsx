import { KeyboardAvoidingView, FlatList, View, Text, TextInput, Modal, Image, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTopicItem } from './useTopicItem.hook';
import { styles } from './TopicItem.styled';
import Colors from 'constants/Colors';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import avatar from 'images/avatar.png';
import { VideoThumb } from './videoThumb/VideoThumb';
import { AudioThumb } from './audioThumb/AudioThumb';
import { ImageThumb } from './imageThumb/ImageThumb';
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import Carousel from 'react-native-reanimated-carousel';
import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";

export function TopicItem({ item, focused, focus, hosting, remove, update, block, report, contentKey }) {

  const { state, actions } = useTopicItem(item, hosting, remove, contentKey);

  const erase = () => {
    Alert.alert(
      "Removing Message",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Remove",
          onPress: async () => {
            try {
              await remove(item.topicId);
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Remove Message',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }

  const shareMessage = async () => {
    console.log("SHARING!", item);

    try {
      const files = []
      const fs = RNFetchBlob.fs;

      const data = JSON.parse(item.detail.data)
      const assets = data.assets || []
      for (let i = 0; i < assets.length; i++) {
        if (assets[i].image) {
          const url = actions.getTopicAssetUrl(item.topicId, assets[i].image.full);
          const blob = await RNFetchBlob.config({ fileCache: true }).fetch("GET", url);
          const type = blob.respInfo.headers["Content-Type"];
          const file = await blob.readFile("base64");
          fs.unlink(blob.path());

          files.push(`data:${type};base64,${file}`)
        }
      }
      
      Share.open({ urls: files, message: data.text })
    }
    catch(err) {
      console.log(err);
      Alert.alert(
        'Failed to Share Message',
        'Please try again.'
      )
    }
  }

  const reportMessage = () => {
    Alert.alert(
      "Report Message",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Report",
          onPress: async () => {
            try {
              await report(item.topicId);
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Report Message',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }

  const hideMessage = () => {
    Alert.alert(
      "Blocking Message",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Block",
          onPress: async () => {
            try {
              await block(item.topicId);
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Block Message',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }


  const renderAsset = (asset) => {
    return (
      <View style={styles.frame}>
        { asset.item.image && (
          <ImageAsset topicId={item.topicId} asset={asset.item.image} dismiss={actions.hideCarousel} />
        )}
        { asset.item.video && (
          <VideoAsset topicId={item.topicId} asset={asset.item.video} dismiss={actions.hideCarousel} />
        )}
        { asset.item.audio && (
          <AudioAsset topicId={item.topicId} asset={asset.item.audio} dismiss={actions.hideCarousel} />
        )}
      </View>
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
    <View style={{ ...styles.wrapper, transform: [{rotate: '180deg'}]}}>
      <View style={styles.item}>
        <TouchableOpacity activeOpacity={1} onPress={focus} style={styles.header}>
          { state.logo !== 'avatar' && state.logo && (
            <Image source={{ uri: state.logo }} style={{ width: 28, height: 28, borderRadius: 6 }} />
          )}
          { (state.logo === 'avatar' || !state.logo) && (
            <Image source={avatar} style={{ width: 28, height: 28, borderRadius: 6 }} />
          )}
          <Text style={{ ...styles.name, color: state.nameSet ? Colors.text : Colors.grey }}>{ state.name }</Text>
          <Text style={styles.timestamp}>{ state.timestamp }</Text>
        </TouchableOpacity>
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
                <MatIcons name="weather-cloudy-alert" size={32} color={Colors.alert} />
              </View>
            )}
            { state.clickable && !state.sealed && (
              <Text style={{ ...styles.message, fontSize: state.fontSize, color: state.fontColor }}>{ state.clickable }</Text>
            )}
            { state.sealed && (
              <Text style={ styles.sealed }>sealed message</Text>
            )}
          </>
        )}
        { state.status !== 'confirmed' && (
          <View style={styles.status}>
            <MatIcons name="cloud-refresh" size={32} color={Colors.divider} />
          </View>
        )}
      </View>
      { focused && (
        <View style={styles.focused}>
           <TouchableOpacity style={styles.icon} onPress={shareMessage}>
            <MatIcons name="share-variant-outline" size={18} color={Colors.white} />
          </TouchableOpacity>
          { state.editable && (
            <TouchableOpacity style={styles.icon} onPress={() => update(item.topicId, state.editType, state.editData)}>
              <AntIcons name="edit" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          { !state.editable && (
            <TouchableOpacity style={styles.icon} onPress={hideMessage}>
              <MatIcons name="block-helper" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
          { !state.editable && (
            <TouchableOpacity style={styles.icon} onPress={reportMessage}>
              <MatIcons name="flag-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
          { state.deletable && (
            <TouchableOpacity style={styles.icon} onPress={erase}>
              <MatIcons name="delete-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
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
          <Carousel
            loop
            width={state.width}
            autoPlay={false}
            data={state.assets}
            defaultIndex={state.carouselIndex}
            scrollAnimationDuration={1000}
            renderItem={({ index }) => (
              <View style={styles.frame}>
                { state.assets[index].image && (
                  <ImageAsset topicId={item.topicId} asset={state.assets[index].image} dismiss={actions.hideCarousel} />
                )}
                { state.assets[index].video && (
                  <VideoAsset topicId={item.topicId} asset={state.assets[index].video} dismiss={actions.hideCarousel} />
                )}
                { state.assets[index].audio && (
                  <AudioAsset topicId={item.topicId} asset={state.assets[index].audio} dismiss={actions.hideCarousel} />
                )}
              </View>
            )} />
        </View>
      </Modal> 
    </View>
  );
}
