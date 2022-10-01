import { Image, FlatList, TextInput, Alert, View, TouchableOpacity, Text, } from 'react-native';
import { useState, useRef } from 'react';
import { useAddTopic } from './useAddTopic.hook';
import { styles } from './AddTopic.styled';
import AntIcons from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker'
import { VideoFile } from './videoFile/VideoFile';
import { ImageFile } from './imageFile/ImageFile';

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

  const addVideo = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'video' });
      actions.addVideo(full.path);
    }
    catch (err) {
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
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="music-box-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="format-size" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="palette-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="send-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

