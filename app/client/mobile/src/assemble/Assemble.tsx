import React, {useState} from 'react';
import {useTheme, Surface, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, FlatList, Pressable, Modal, View, Image, ScrollView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './Assemble.styled';
import {useAssemble} from './useAssemble.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Card} from '../card/Card';

export function Assemble({ close, openConversation }: { close: ()=>void, openConversation: ()=>void}) {
  const { state, actions } = useAssemble();
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
  }

  return (
    <View style={styles.request}>
      <Surface elevation={9} mode="flat" style={{ width: '100%', height: 72, display: 'flex', flexDirection: 'row', paddingBottom: 16, paddingLeft: 16, paddingRight: 16, alignItems: 'center', gap: 16 }}>
        <Pressable style={styles.navIcon} onPress={close}>
          <Icon size={24} source="left" color={'white'} />
        </Pressable>
        <Surface mode="flat" elevation={0} style={{ flexGrow: 1, borderRadius: 8, overflow: 'hidden' }}>
          <TextInput
            dense={true}
            style={styles.input}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            underlineStyle={styles.inputUnderline}
            mode="outlined"
            placeholder={state.strings.addSubject}
            left={<TextInput.Icon style={styles.icon} icon="search" />}
          />
        </Surface>
        <Button icon="message1" mode="contained" textColor="white" style={styles.newButton} onPress={openConversation}>
          {state.strings.chat}
        </Button>
      </Surface>

      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        { state.contacts.length > 0 && (
          <FlatList
            style={styles.cards}
            data={state.contacts}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const connect = state.cards.has(item.guid) ? [] : [<IconButton style={styles.connect} iconColor={theme.colors.primary} icon={'user-plus'} key="request" onPress={() => { actions.setFocus(null, '2c05d60e-872b-4688-9ec8-94b64e9e4150'), openConversation()}} loading={connecting === item.guid} />];
              return (
                <Card
                  containerStyle={{ ...styles.card, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  handle={item.handle}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={()=>{}}
                  actions={connect}
                />
              );
            }}
            keyExtractor={profile => profile.guid}
          />
        )}
        { state.contacts.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.noContacts}>{ state.strings.noContacts }</Text>
          </View>
        )}
      </Surface>
    </View>
  );
}
