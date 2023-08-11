import { ActivityIndicator, Modal, Image, FlatList, TextInput, Alert, View, TouchableOpacity, Text, } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAddTopic } from './useAddTopic.hook';
import { styles } from './AddTopic.styled';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'
import ColorPicker from 'react-native-wheel-color-picker'
import { VideoFile } from './videoFile/VideoFile';
import { AudioFile } from './audioFile/AudioFile';
import { ImageFile } from './imageFile/ImageFile';
import { BinaryFile } from './binaryFile/BinaryFile';

export function AddTopic({ contentKey, shareIntent, setShareIntent }) {

  const { state, actions } = useAddTopic(contentKey);

  useEffect(() => {
    if (shareIntent && state.loaded) {
      if (!state.locked || contentKey) { 
        shareIntent.forEach(share => {
          if (share.text) {
            actions.setMessage(share.text);
          }
          if (share.weblink) {
            actions.setMessage(share.weblink);
          }
          const mime = share.mimeType?.toLowerCase();
          if (mime === '.jpg' || mime === '.png' || mime === 'image/jpeg' || mime == 'image/png' ) {
            actions.addImage(share.filePath)
          }
          if (mime === '.mp4' || mime === 'video/mp4' || mime == 'video/mpeg') {
            actions.addVideo(share.filePath)
          }
          if (mime === '.mp3') {
            actions.addAudio(share.filePath)
          }
        });
        setShareIntent(null);
      }
    }
  }, [shareIntent, state.loaded, state.locked, contentKey]);

  const addImage = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'photo' });
      actions.addImage(full.path, full.mime);
    }
    catch (err) {
      console.log(err);
    }
  }

  const sendMessage = async () => {
    try {
      if (!state.conflict && (state.message || state.assets.length > 0)) {
        await actions.addTopic();
      }
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Send Message',
        'Please try again.',
      )
    }
  }

  const addVideo = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'video' });
      actions.addVideo(full.path);
    }
    catch (err) {
      console.log(err);
    }
  }

  const addAudio = async () => {
    try {
      const audio = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: DocumentPicker.types.audio,
      })
      actions.addAudio(audio.fileCopyUri, audio.name.replace(/\.[^/.]+$/, ""));
    } catch (err) {
      console.log(err);
    }
  }

  const addBinary = async () => {
    try {
      const binary = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: DocumentPicker.types.allFiles,
      })
      actions.addBinary(binary.fileCopyUri, binary.name);
    } catch (err) {
      console.log(err);
    }
  }

  const remove = (item) => {
    Alert.alert(
      `Removing ${item.type} from message.`,
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Remove", onPress: () => {
          actions.removeAsset(item.key);
        }}
      ]
    );
  }

  const renderAsset = ({ item }) => {
    if (item.type === 'image') {
      return (
        <ImageFile path={item.data} remove={() => remove(item)} />
      );
    }
    if (item.type === 'video') {
      return (
        <VideoFile path={item.data}
          remove={() => remove(item)}
          setPosition={(position) => actions.setVideoPosition(item.key, position)}
        />
      )
    }
    if (item.type === 'audio') {
      return (
        <AudioFile path={item.data} label={item.label} remove={() => remove(item)}
            setLabel={(label) => actions.setLabel(item.key, label)} />
      )
    }
    if (item.type === 'binary') {
      return (
        <BinaryFile path={item.data} label={item.label} extension={item.extension} remove={() => remove(item)}
            setLabel={(label) => actions.setLabel(item.key, label)} />
      )
    }
    else {
      return (
        <View style={styles.asset}></View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.add} edges={['right']}>
      { !state.uploadError && state.progress && (
        <View style={{ height: 0, width: `${state.progress}%`, borderColor: Colors.background, borderWidth: 1 }} />
      )}
      { !state.uploadError && !state.progress && (
        <View style={{ height: 0, width: '100%', borderColor: Colors.formBackground, borderWidth: 1 }} />
      )}
      { state.uploadError && (
        <View style={{ height: 0, width: '100%', borderColor: Colors.alert, borderWidth: 1 }} />
      )}
      { state.assets.length > 0 && (
        <FlatList style={styles.carousel}
          data={state.assets}
          horizontal={true}
          renderItem={renderAsset}
        />
      )}
      <TextInput style={{ ...styles.input, color: state.color, fontSize: state.textSize }} value={state.message} onChangeText={actions.setMessage} 
          placeholderTextColor={state.color} cursorColor={state.color}
          blurOnSubmit={true} onSubmitEditing={sendMessage} returnKeyType="send"
          autoCapitalize="sentences" placeholder="New Message" multiline={true} />
      <View style={styles.addButtons}>
        { state.enableImage && (
          <TouchableOpacity style={styles.addButton} onPress={addImage}>
            <AntIcons name="picture" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
        { state.enableVideo && (
          <TouchableOpacity style={styles.addButton} onPress={addVideo}>
            <MatIcons name="video-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        )}
        { state.enableAudio && (
          <TouchableOpacity style={styles.addButton} onPress={addAudio}>
            <MatIcons name="music-box-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.addButton} onPress={addBinary}>
          <MatIcons name="all-inclusive-box-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.addButton} onPress={actions.showFontSize}>
          <MatIcons name="format-size" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={actions.showFontColor}>
          <MatIcons name="palette-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.addButton} onPress={sendMessage}>
          { state.busy && (
            <ActivityIndicator color={Colors.primary} />
          )}
          { state.conflict && (
            <MatIcons name="send-outline" size={20} color={Colors.alert} />
          )}
          { !state.conflict && state.locked && !contentKey && (
            <MatIcons name="lock" size={20} color={Colors.lightgrey} />
          )}
          { !state.conflict && !state.busy && (!state.locked || contentKey) && (state.message || state.assets.length > 0) && (
            <MatIcons name="send-outline" size={20} color={Colors.text} />
          )}
          { !state.conflict && !state.busy && (!state.locked || contentKey) && !(state.message || state.assets.length > 0) && (
            <MatIcons name="send-outline" size={20} color={Colors.lightgrey} />
          )}
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.fontSize}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideFontSize}
      >
        <View style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Font Size:</Text>
            <View style={styles.editSize}>
              { state.size === 'small' && (
                <View style={styles.selected}>
                  <Text style={styles.selectedText}>Small</Text>
                </View>
              )}
              { state.size !== 'small' && (
                <TouchableOpacity style={styles.option} onPress={() => actions.setFontSize('small')}>
                  <Text style={styles.optionText}>Small</Text>
                </TouchableOpacity>
              )}
              { state.size === 'medium' && (
                <View style={styles.selected}>
                  <Text style={styles.selectedText}>Medium</Text>
                </View>
              )}
              { state.size !== 'medium' && (
                <TouchableOpacity style={styles.option} onPress={() => actions.setFontSize('medium')}>
                  <Text style={styles.optionText}>Medium</Text>
                </TouchableOpacity>
              )}
              { state.size === 'large' && (
                <View style={styles.selected}>
                  <Text style={styles.selectedText}>Large</Text>
                </View>
              )}
              { state.size !== 'large' && (
                <TouchableOpacity style={styles.option} onPress={() => actions.setFontSize('large')}>
                  <Text style={styles.optionText}>Large</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.editControls}>
              <View style={styles.selection} />
              <TouchableOpacity style={styles.close} onPress={actions.hideFontSize}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.fontColor}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideFontColor}
      >
        <View style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Font Color:</Text>
            <View style={styles.editColor}>
              <ColorPicker
                color={state.color}
                onColorChange={actions.setFontColor}
                onColorChangeComplete={actions.setFontColor}
                swatched={false}
                style={{flex: 1, padding: 8}} />
            </View>
            <View style={styles.editControls}>
              <View style={styles.selection}>
                <Text>Set Color:</Text>
                <View style={{ marginLeft: 6, borderRadius: 4, width: 16, height: 16, backgroundColor: state.color }} />
              </View>
              <TouchableOpacity style={styles.close} onPress={actions.hideFontColor}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


