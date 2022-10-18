import { KeyboardAvoidingView, FlatList, View, Text, TextInput, Modal, Image, Alert } from 'react-native';
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

export function TopicItem({ item, focused, focus, hosting, remove, update }) {

  const { state, actions } = useTopicItem(item, hosting);

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

  const editMessage = async () => {
    try {
      await update(item.topicId, { ...state.editData, text: state.editMessage });
      actions.hideEdit();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Update Message',
        'Please try again.',
      )
    }
  }

  const block = () => {
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
              await actions.block();
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
          <AudioAsset topicId={item.topicId} asset={asset.item.audio} active={state.activeId == asset.dataIndex}
              setActive={() => actions.setActive(asset.dataIndex)} dismiss={actions.hideCarousel} />
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
    <View style={styles.wrapper}>
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
              <Text style={{ ...styles.message, fontSize: state.fontSize }}>{ state.message }</Text>
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
            <Carousel
              data={state.assets}
              firstItem={state.carouselIndex}
              renderItem={renderAsset}
              sliderWidth={state.width}
              itemWidth={state.width}
            />
          </View>
        </Modal> 
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.editing}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideEdit}
        >
          <KeyboardAvoidingView behavior="height" style={styles.modal}>
            <View style={styles.editContainer}>
              <Text style={styles.editHeader}>Edit Message Text:</Text>
              <View style={styles.inputField}>
                <TextInput style={styles.input} value={state.editMessage} onChangeText={actions.setEditMessage}
                    autoCapitalize="sentences" placeholder="Message Text" multiline={true} />
              </View>
              <View style={styles.editControls}>
                <TouchableOpacity style={styles.cancel} onPress={actions.hideEdit}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.save} onPress={editMessage}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal> 
      </TouchableOpacity>
      { focused && (
        <View style={styles.focused}>
          { state.editable && (
            <TouchableOpacity style={styles.icon} onPress={actions.showEdit}>
              <AntIcons name="edit" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.icon} onPress={block}>
            <MatIcons name="block-helper" size={18} color={Colors.white} />
          </TouchableOpacity>
          { state.deletable && (
            <TouchableOpacity style={styles.icon} onPress={erase}>
              <MatIcons name="delete-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

