import React, {useState} from 'react';
import { Button, Surface, Icon, Text, IconButton, Divider } from 'react-native-paper';
import { Modal, Image, SafeAreaView, View } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import {BlurView} from '@react-native-community/blur';

export type ContactParams = {
  guid: string;
  handle?: string;
  node?: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  cardId?: string;
  status?: string;
  offsync?: boolean;
}

export function Profile({ close, params }) {
  const [ alert, setAlert ] = useState(false);
  const { state, actions } = useProfile(params);

  return (
    <View style={styles.profile}>
      <SafeAreaView style={styles.header}>
        <View style={styles.spaceHolder}>
          { close && (
            <IconButton style={styles.back} compact="true"  mode="contained" icon="arrow-left" size={24} onPress={close} />
          )}
        </View>
        <Text
          style={styles.headerLabel}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>{`${state.handle}${
          state.node ? '/' + state.node : ''
        }`}</Text>
        <View style={styles.spaceHolder}></View>
      </SafeAreaView>

      <View style={styles.image}>
        <Image
          style={styles.logo}
          resizeMode={'contain'}
          source={{uri: state.imageUrl}}
        />
      </View>

      <View style={styles.body}>
        <Divider style={styles.line} bold={true} />
        <View style={styles.attributes}>
          {!state.name && (
            <Text style={styles.nameUnset}>{state.strings.name}</Text>
          )}
          {state.name && (
            <Text
              style={styles.nameSet}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              {state.name}
            </Text>
          )}
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="map-marker-outline" />
            </View>
            {!state.location && (
              <Text style={styles.labelUnset}>{state.strings.location}</Text>
            )}
            {state.location && (
              <Text style={styles.labelSet}>{state.location}</Text>
            )}
          </View>
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="book-open-outline" />
            </View>
            {!state.description && (
              <Text style={styles.labelUnset}>
                {state.strings.description}
              </Text>
            )}
            {state.description && (
              <Text style={styles.labelSet}>{state.description}</Text>
            )}
          </View>
        </View>
        <Divider style={styles.line} bold={true} />
        <View style={styles.status}>
          <Text style={styles[state.statusLabel]}>{ state.strings[state.statusLabel] }</Text>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={alert}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setAlert(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <View style={styles.content}>
            <Surface elevation={1} mode="flat" style={styles.surface}>
              <Text variant="titleLarge">{state.strings.error}</Text>
              <Text variant="titleSmall">{state.strings.tryAgain}</Text>
              <Button
                mode="text"
                style={styles.close}
                onPress={() => setAlert(false)}>
                {state.strings.close}
              </Button>
            </Surface>
          </View>
        </View>
      </Modal>
    </View>
  )
}

