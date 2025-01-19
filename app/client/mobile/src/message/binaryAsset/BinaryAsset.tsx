import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Share, Pressable, View, Image, Animated, useAnimatedValue } from 'react-native'
import { Text, Surface, Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useBinaryAsset } from './useBinaryAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './BinaryAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'
import thumb from '../../images/binary.png';

export function BinaryAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useBinaryAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);
  const [alert, setAlert] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (show) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [show]);

  const share = async () => {
    try {
      setAlert('');
      await actions.download();
    } catch (err) {
      console.log(err);
      setAlert(state.strings.operationFailed)
    }
  }

  const showBinary = () => {
    setAlert('');
    setModal(true);
    actions.loadBinary();
  };

  const hideBinary = () => {
    setModal(false);
    actions.cancelLoad();
  }

  const download = async () => {
    if (!downloading) {
      setDownloading(true);
      try {
        await actions.download();
      } catch (err) {
        console.log(err);
      }
      setDownloading(false);
    }
  }

  return (
    <View style={styles.binary}>
      <Pressable onPress={showBinary}>
        <Animated.View style={[styles.container,{opacity},]}>
          <Image
            style={styles.thumb}
            resizeMode="contain"
            height={92}
            width={92}
            source={thumb}
            onLoad={loaded}
          />
          <Surface elevation={2} style={styles.button}>
            <Icon size={28} source="download-outline" />
          </Surface>
          <Text style={styles.info} numberOfLines={1}>{ asset.binary?.label || asset.encrypted?.label }</Text>
        </Animated.View>
      </Pressable>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={hideBinary}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <View style={styles.cover}>
            <Image
              style={styles.full}
              resizeMode="contain"
              source={thumb}
            />
            { state.dataUrl && (
              <Surface elevation={2} style={styles.button}>
                <IconButton style={styles.control} size={64} icon="download-outline" loading={downloading} onPress={download} />
              </Surface>
            )}
          </View>
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.alert}>
            <Text style={styles.alertLabel}>{ alert }</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.close}>
            <Text style={styles.label} adjustsFontSizeToFit={true} numberOfLines={1}>{ asset.binary?.label || asset.encrypted?.label }</Text>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideBinary} />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

