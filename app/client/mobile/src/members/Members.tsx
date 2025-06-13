import React, {useState, useRef} from 'react';
import {useTheme, Surface, Checkbox, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, FlatList, Pressable, Modal, View, Image, ScrollView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './Members.styled';
import {useMembers} from './useMembers.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Card} from '../card/Card';
import {Confirm} from '../confirm/Confirm';

export function Members({ close }: { close: ()=>void }) {
  const { state, actions } = useMembers();
  const selected = useRef(new Set<string>());
  const [subject, setSubject] = useState(null);
  const [creating, setCreating] = useState(false);
  const theme = useTheme();
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    confirm: {
      label: state.strings.ok,
      action: () => setAlert(false),
    },
  });
  const seal = state.sealSet && state.sealUnlocked && state.createSealed;

  const toggle = (cardId: string, set: boolean) => {
    if (set) {
      selected.current.add(cardId);
    } else {
      selected.current.delete(cardId);
    }
  }

  const create = async () => {
    if (!creating) {
      setCreating(true);
      try {
        const filtered = state.connected.filter(item => (!seal || item.sealable) && selected.current.has(item.cardId));
        const id = await actions.addTopic(seal || !state.allowUnsealed, subject, filtered.map(item => item.cardId));
        actions.setFocus(null, id);
        openConversation();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setCreating(false);
    }
  }

  return (
    <View style={styles.request}>
      <Surface elevation={9} mode="flat" style={{ width: '100%', height: 72, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 16, paddingLeft: 8, paddingBottom: 16 }}>
        <Pressable style={styles.navIcon} onPress={close}>
          <Icon size={24} source="left" color={'white'} />
        </Pressable>
        <Text variant="headlineSmall" style={styles.navTitle}>{ state.strings.chatMembers }</Text>
        <View style={styles.navIcon} />
      </Surface>

      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        { state.access && !state.locked && state.connected.length > 0 && (
          <FlatList
            style={styles.cards}
            contentContainerStyle={{ paddingBottom: 128 }}
            data={state.connected}
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
                  actions={[]}
                />
              );
            }}
            keyExtractor={profile => profile.guid}
          />
        )}
        { state.connected.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.noContacts}>{ state.strings.noContacts }</Text>
          </View>
        )}
      </Surface>
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
