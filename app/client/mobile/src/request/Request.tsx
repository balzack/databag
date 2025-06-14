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

export function Request({setupNav}: {setupNav: {back: () => void; next: () => void}}) {
  const {state, actions} = useRequest();
  const theme = useTheme();
  const [connecting, setConnecting] = useState(null as null | string);
  const [requested, setRequested] = useState(false);

  const addContact = async (server: string, guid: string) => {
    if (!connecting) {
      setConnecting(guid);
      try {
        await actions.saveAndConnect(server, guid);
        setRequested(true);
        await new Promise(r => setTimeout(r, 3000));
        setRequested(false);
      } catch (err) {
        console.log(err);
      }
      setConnecting(null);
    }
  };

  return (
    <View style={styles.request}>
      <View style={styles.navHeader}>
        <Pressable style={styles.navIcon} onPress={setupNav?.back}>
          <Icon size={24} source="left" color={'white'} />
        </Pressable>
        <Text variant="headlineSmall" style={styles.navTitle}>
          {state.strings.connectWith}
        </Text>
        <View style={styles.navIcon} />
      </View>
      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        {state.contacts.length > 0 && (
          <FlatList
            style={styles.cards}
            data={state.contacts}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const connect = state.cards.has(item.guid)
                ? []
                : [
                    <IconButton
                      style={styles.connect}
                      iconColor={theme.colors.primary}
                      icon={'user-plus'}
                      key="request"
                      onPress={() => addContact(item.node, item.guid)}
                      loading={connecting === item.guid}
                    />,
                  ];
              return (
                <Card
                  containerStyle={{...styles.card, handle: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  handle={item.handle}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={() => {}}
                  actions={connect}
                />
              );
            }}
            keyExtractor={profile => profile.guid}
          />
        )}
        {state.contacts.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.noContacts}>{state.strings.noContacts}</Text>
          </View>
        )}
        <Divider />
        <Surface elevation={2} mode="flat" style={styles.control}>
          <Button mode="contained" style={styles.submit} onPress={setupNav?.next}>
            {state.strings.next}
          </Button>
          <Button mode="text" style={styles.skip} onPress={actions.clearWelcome}>
            {state.strings.skipSetup}
          </Button>
        </Surface>
      </Surface>
      <Modal animationType="fade" transparent={true} visible={requested} supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setSealing(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={3} style={styles.content}>
            <Icon size={64} source="check" color={theme.colors.primary} />
            <Text variant="headlineSmall">{state.strings.requestSent}</Text>
            <Text style={styles.label}>{state.strings.friendsNotified}</Text>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
