import React, {useState, useRef} from 'react';
import {useTheme, Surface, Checkbox, Button, Text, Icon, TextInput} from 'react-native-paper';
import {FlatList, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './Assemble.styled';
import {useAssemble} from './useAssemble.hook';
import {Card} from '../card/Card';
import {Confirm} from '../confirm/Confirm';

function Member({enabled, toggle, placeholder}: {enabled: boolean; toggle: (checked: boolean) => void; placeholder: string}) {
  const [checked, setChecked] = useState(false);
  if (enabled) {
    return (
      <Checkbox.Android
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          toggle(!checked);
          setChecked(!checked);
        }}
      />
    );
  } else {
    return <Text style={styles.memberText}>{placeholder}</Text>;
  }
}

export function Assemble({layout, close, openConversation}: {layout: string, close: () => void; openConversation: () => void}) {
  const {state, actions} = useAssemble();
  const selected = useRef(new Set<string>());
  const [subject, setSubject] = useState(null);
  const [creating, setCreating] = useState(false);
  const theme = useTheme();
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    close: {
      label: state.strings.close,
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
  };

  const create = async () => {
    if (!creating) {
      setCreating(true);
      try {
        const filtered = state.connected.filter(item => (!seal || item.sealable) && selected.current.has(item.cardId));
        const id = await actions.addTopic(
          seal || !state.allowUnsealed,
          subject,
          filtered.map(item => item.cardId),
        );
        actions.setFocus(null, id);
        openConversation();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setCreating(false);
    }
  };

  return (
    <View style={styles.request}>
      <Surface elevation={layout === 'large' ? 1 : 9} mode="flat" style={styles.fullWidthSurface}>
        <SafeAreaView edges={['left', 'right']} style={layout === 'large' ? {...styles.headerSafeBar, borderColor: theme.colors.elevation.level9} : styles.headerSafeArea}>
          <Pressable style={styles.navIcon} onPress={close}>
            {layout === 'large' && (
              <Icon size={32} source="close" />
            )}
            {layout !== 'large' && (
              <Icon size={32} source="left" color={'white'} />
            )}
          </Pressable>
          <Surface mode="flat" elevation={0} style={styles.inputSurface}>
            <TextInput
              style={styles.input}
              mode="outlined"
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputBorder}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              dense={true}
              multiline={false}
              numberofLines={1}
              placeholder={state.strings.addSubject}
              left={<TextInput.Icon style={styles.icon} icon="edit" />}
              value={subject}
              onChangeText={value => setSubject(value)}
            />
          </Surface>
          {(seal || state.allowUnsealed) && (
            <Button icon="message1" mode="contained" loading={creating} textColor="white" style={styles.newButton} contentStyle={styles.newContent} onPress={create}>
              {state.strings.chat}
            </Button>
          )}
        </SafeAreaView>
      </Surface>

      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        {state.connected.length > 0 && (
          <FlatList
            style={styles.cards}
            contentContainerStyle={styles.listContainer}
            data={state.connected}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const member = <Member key="member" enabled={!seal || item.sealable} toggle={set => toggle(item.cardId, set)} placeholder={state.strings.noKey} />;
              return (
                <Card
                  containerStyle={{...styles.card, handle: {...styles.cardHandle, color: theme.colors.onSecondary}}}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  handle={item.handle}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={() => {}}
                  actions={[member]}
                />
              );
            }}
            keyExtractor={profile => profile.cardId}
          />
        )}
        {state.connected.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.noContacts}>{state.strings.noContacts}</Text>
          </View>
        )}
      </Surface>
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
