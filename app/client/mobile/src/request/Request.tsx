import React, {useState} from 'react';
import {useTheme, Surface, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, Pressable, Modal, View, Image, ScrollView, Platform} from 'react-native';
import {styles} from './Request.styled';
import {useRequest} from './useRequest.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function Request({ setupNav }: { setupNav: {back: ()=>void, next: ()=>void}}) {
  const { state, request } = useRequest();

  return (
    <View style={styles.request}>
      <View style={styles.navHeader}>
        <Pressable style={styles.navIcon} onPress={setupNav?.back}>
          <Icon size={24} source="left" color={'white'} />
        </Pressable>
        <Text variant="titleMedium" style={styles.navTitle}>{ state.strings.connectWith }</Text>
        <View style={styles.navIcon} />
      </View>
      <Surface elevation={3} mode="flat" style={styles.scrollWrapper}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        </KeyboardAwareScrollView>
      </Surface>
    </View>
  );
}
