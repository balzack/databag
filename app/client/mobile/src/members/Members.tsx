import React, {useState} from 'react';
import {useTheme, Surface, Text, Icon, Switch} from 'react-native-paper';
import {FlatList, Pressable, View} from 'react-native';
import {styles} from './Members.styled';
import {useMembers} from './useMembers.hook';
import {Card} from '../card/Card';
import {Confirm} from '../confirm/Confirm';
import {SafeAreaView} from 'react-native-safe-area-context';

export function Members({close}: {close: () => void}) {
  const {state, actions} = useMembers();
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

  const update = async (cardId: string, member: boolean) => {
    try {
      if (member) {
        await actions.setMember(cardId);
      } else {
        await actions.clearMember(cardId);
      }
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
  };

  return (
    <View style={styles.request}>
      <Surface elevation={9} mode="flat" style={styles.surface}>
        <SafeAreaView edges={['left', 'right']} style={styles.safeAreaNav}>
          <Pressable style={styles.navIcon} onPress={close}>
            <Icon size={24} source="left" color={'white'} />
          </Pressable>
          <Text style={styles.navTitle}>{state.strings.chatMembers}</Text>
          <View style={styles.navIcon} />
        </SafeAreaView>
      </Surface>

      <Surface elevation={1} mode="flat" style={styles.scrollWrapper}>
        {state.host && state.access && !state.locked && state.filtered.length > 0 && (
          <FlatList
            style={styles.cards}
            contentContainerStyle={styles.listContainer}
            data={state.filtered}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const added = Boolean(state.members.find(member => member === item.guid));
              const action = (state.sealed && !item.sealable) ? <Text style={styles.noKey}>{state.strings.noKey}</Text> : <Switch key="action" style={styles.controlSwitch} value={added} onValueChange={() => update(item.cardId, !added)} />
              return (
                <Card
                  containerStyle={{...styles.cardContainer, handle: {...styles.cardHandle, color: theme.colors.onSecondary}}}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  handle={item.handle}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={() => {}}
                  actions={[action]}
                />
              );
            }}
            keyExtractor={profile => profile.guid}
          />
        )}
        {state.filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.noContacts}>{state.strings.noContacts}</Text>
          </View>
        )}
      </Surface>
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
