import { ActivityIndicator, Modal, Image, FlatList, TextInput, Alert, View, TouchableOpacity, Text, } from 'react-native';
import { useState, useRef } from 'react';
import { useAddTopic } from './useAddTopic.hook';
import { styles } from './AddTopic.styled';
import AntIcons from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker'
import { VideoFile } from './videoFile/VideoFile';
import { AudioFile } from './audioFile/AudioFile';
import { ImageFile } from './imageFile/ImageFile';
import DocumentPicker from 'react-native-document-picker'
import ColorPicker from 'react-native-wheel-color-picker'

export function AddTopic() {

  const { state, actions } = useAddTopic();

  const addImage = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'photo' });
      actions.addImage(full.path);
    }
    catch (err) {
      console.log(err);
    }
  }

  const sendMessage = async () => {
    try {
      await actions.addTopic();
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
            setLabel={(label) => actions.setAudioLabel(item.key, label)} />
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
      { state.assets.length > 0 && (
        <FlatList style={styles.carousel}
          data={state.assets}
          horizontal={true}
          renderItem={renderAsset}
        />
      )}
      <TextInput style={styles.input} value={state.message} onChangeText={actions.setMessage}
          autoCapitalize="sentences" placeholder="New Message" multiline={true} />
      <View style={styles.addButtons}>
        <TouchableOpacity style={styles.addButton} onPress={addImage}>
          <AntIcons name="picture" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addVideo}>
          <MaterialIcons name="video-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addAudio}>
          <MaterialIcons name="music-box-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.addButton} onPress={actions.showFontSize}>
          <MaterialIcons name="format-size" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={actions.showFontColor}>
          <MaterialIcons name="palette-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.addButton} onPress={sendMessage}>
          { state.busy && (
            <ActivityIndicator color={Colors.white} />
          )}
          { !state.busy && (state.message || state.assets.length > 0) && (
            <MaterialIcons name="send-outline" size={20} color={Colors.text} />
          )}
          { !state.busy && !(state.message || state.assets.length > 0) && (
            <MaterialIcons name="send-outline" size={20} color={Colors.lightgrey} />
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

