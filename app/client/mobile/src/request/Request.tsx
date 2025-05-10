import React, {useState} from 'react';
import {useTheme, Surface, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, FlatList, Pressable, Modal, View, Image, ScrollView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './Request.styled';
import {useRequest} from './useRequest.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Card} from '../card/Card';

export function Request({ setupNav }: { setupNav: {back: ()=>void, next: ()=>void}}) {
  const { state, request } = useRequest();
  const theme = useTheme();

  return (
    <View style={styles.request}>
      <View style={styles.navHeader}>
        <Pressable style={styles.navIcon} onPress={setupNav?.back}>
          <Icon size={24} source="left" color={'white'} />
        </Pressable>
        <Text variant="headlineSmall" style={styles.navTitle}>{ state.strings.connectWith }</Text>
        <View style={styles.navIcon} />
      </View>
      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        <FlatList
          style={styles.cards}
          data={state.profiles}
          initialNumToRender={32}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <Card
                containerStyle={{ ...styles.card, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                imageUrl={item.imageUrl}
                name={item.name}
                handle={item.handle}
                node={item.node}
                placeholder={state.strings.name}
                select={()=>{}}
                actions={[<IconButton style={styles.connect} icon="user-plus" key="request" />]}
              />
            );
          }}
          keyExtractor={profile => profile.guid}
        />
        <Divider />
        <Surface elevation={2} mode="flat"  style={styles.control}>
          <Button mode="contained" style={styles.submit} onPress={setupNav?.next}>
            {state.strings.next}
          </Button>
          <Button mode="text" style={styles.skip}>
            {state.strings.skipSetup}
          </Button>
        </Surface>
      </Surface>
    </View>
  );
}
