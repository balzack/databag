import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Share, Modal, Pressable, Animated, View, Image, useAnimatedValue } from 'react-native'
import { Text, ProgressBar, IconButton } from 'react-native-paper'
import { useImageAsset } from './useImageAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './ImageAsset.styled'
import {BlurView} from '@react-native-community/blur';

export function ImageAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useImageAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (state.loaded && show) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    if (state.loaded) {
      loaded();
    }
  }, [state.loaded, show]);

  const showImage = () => {
    setModal(true);
    actions.loadImage();
  };

  const hideImage = () => {
    setModal(false);
    actions.cancelLoad();
  }

  const download = async () => {
    try {
      setAlert('');
      await Share.share({ url: state.dataUrl });
    } catch (err) {
      console.log(err);
      setAlert(state.strings.operationFailed)
    }
  }

  return (
    <View style={styles.image}>
      { state.thumbUrl && (
        <Pressable onPress={showImage}>
          <Animated.Image
            style={[styles.thumb,{opacity},]}
            resizeMode="contain"
            height={92}
            width={92 * state.ratio}
            source={{ uri: state.thumbUrl }}
            onLoad={actions.loaded}
          />
        </Pressable>
      )}
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={hideImage}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <Image
            style={styles.full}
            resizeMode="contain"
            source={{ uri: state.thumbUrl }}
          />
          { state.dataUrl && (
            <Image
              style={styles.full}
              resizeMode="contain"
              onError={(err)=>console.log(err)}
              source={{ uri: state.dataUrl }}
            />
          )}
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            { state.dataUrl && (
              <IconButton style={styles.closeIcon} icon="download" compact="true" mode="contained" size={28} onPress={download} />
            )}
            <View style={styles.spacer} />
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideImage} />
          </SafeAreaView>
          <SafeAreaView style={styles.alert}>
            <Text style={styles.alertLabel}>{ alert }</Text>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

