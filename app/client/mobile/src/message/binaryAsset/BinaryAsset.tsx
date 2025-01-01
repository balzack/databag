import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Pressable, View, Image } from 'react-native'
import { Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useBinaryAsset } from './useBinaryAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './BinaryAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'
import thumb from '../../images/binary.png';

export function BinaryAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useBinaryAsset(topicId, asset);
  const [modal, setModal] = useState(false);

  const showBinary = () => {
    setModal(true);
    actions.loadBinary();
  };

  const hideBinary = () => {
    setModal(false);
    actions.cancelLoad();
  }

  return (
    <View style={styles.audio}>
      <Pressable style={styles.container} onPress={showBinary}>
        <Image
          style={styles.thumb}
          resizeMode="contain"
          source={thumb}
        />
        <View style={styles.button}>
          <Icon size={28} source="download-outline" />
        </View>
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
            <View style={styles.button}>
              <Icon size={64} source="download-outline" />
            </View>
          </View>
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideBinary} />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

