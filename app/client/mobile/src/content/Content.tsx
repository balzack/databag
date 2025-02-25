import React, {useEffect, useState} from 'react';
import {Divider, Switch, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, Modal, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {useContent} from './useContent.hook';
import {Channel} from '../channel/Channel';
import {Focus} from 'databag-client-sdk';
import {BlurView} from '@react-native-community/blur';
import {Card} from '../card/Card';
import {Confirm} from '../confirm/Confirm';
import {Selector} from '../selector/Selector';

export function Content({share, closeAll, openConversation, textCard}: { share: { filePath: string, mimeType: string}, closeAll: ()=>void, openConversation: ()=>void, textCard: {cardId: null|string}}) {
  const [add, setAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sealedTopic, setSealedTopic] = useState(false);
  const {state, actions} = useContent();
  const theme = useTheme();
  const [subjectTopic, setSubjectTopic] = useState('');
  const [members, setMembers] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    confirm: {
      label: state.strings.ok,
      action: () => setAlert(false),
    },
  });
  const cards = state.sealSet && sealedTopic ? state.sealable : state.connected;

  const select = (cardId: string, channelId: string) => {
    actions.setFocus(cardId, channelId);
    openConversation();
  }

  useEffect(() => {
    if (share) {
      closeAll();
    }
  }, [share]);

  useEffect(() => {
    if (textCard.cardId) {
      openTopic(textCard.cardId);
    }
  }, [textCard]);

  const openTopic = async (cardId: string) => {
    setAdding(true);
    try {
      const id = await actions.openTopic(cardId);
      await actions.setFocus(null, id);
      openConversation();
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setAdding(false);
  } 

  const addTopic = async () => {
    setAdding(true);
    try {
      const id = await actions.addTopic(
        sealedTopic,
        subjectTopic,
        members.filter(id => Boolean(cards.find(card => card.cardId === id))),
      );
      setAdd(false);
      setSubjectTopic('');
      setMembers([]);
      setSealedTopic(false);
      await actions.setFocus(null, id);
      openConversation();
    } catch (err) {
      console.log(err);
      setAdd(false);
      setAlert(true);
    }
    setAdding(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Surface mode="flat" elevation={5} style={styles.inputSurface}>
          <TextInput
            dense={true}
            style={styles.input}
            autoCapitalize={false}
            unserlineStyle={styles.inputUnderline}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            mode="outlined"
            placeholder={state.strings.topics}
            left={<TextInput.Icon style={styles.icon} icon="magnify" />}
            value={state.filter}
            onChangeText={value => actions.setFilter(value)}
          />
        </Surface>
        {state.layout !== 'large' && (
          <Button icon="comment-plus" mode="contained" style={styles.button} onPress={() => setAdd(true)}>
            {state.strings.new}
          </Button>
        )}
      </SafeAreaView>
      <Divider style={styles.divider} />

      <View style={styles.content}>
        {state.filtered.length !== 0 && (
          <FlatList
            style={styles.channels}
            data={state.filtered}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const {sealed, focused, hosted, unread, imageUrl, subject, message} = item;
              const open = () => {
                select(item.cardId, item.channelId);
              };
              const Wrap = (state.layout === 'large' && focused) ? Surface : View;
              return (
                <Wrap elevation={1} mode="flat">
                  <Channel
                    containerStyle={{
                      ...styles.channel,
                      borderColor: theme.colors.outlineVariant,
                    }}
                    select={open}
                    unread={unread}
                    sealed={sealed}
                    hosted={hosted}
                    imageUrl={imageUrl}
                    notesPlaceholder={state.strings.notes}
                    subjectPlaceholder={state.strings.unknown}
                    subject={subject}
                    messagePlaceholder={`[${state.strings.sealed}]`}
                    message={message}
                  />
                </Wrap>
              );
            }}
            keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
          />
        )}
        {state.filtered.length === 0 && (
          <View style={styles.none}>
            <Text style={styles.noneLabel}>{state.strings.noTopics}</Text>
          </View>
        )}
      </View>
      {state.layout === 'large' && (
        <View style={styles.bar}>
          <Divider style={styles.divider} />
          <Button icon="comment-plus" mode="contained" style={styles.button} onPress={() => setAdd(true)}>
            {state.strings.new}
          </Button>
        </View>
      )}

      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={add} onRequestClose={() => setAdd(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.addContainer}>
            <Surface elevation={4} mode="flat" style={styles.addSurface}>
              <Text style={styles.addLabel}>{state.strings.newTopic}</Text>
              <IconButton style={styles.addClose} icon="close" size={24} onPress={() => setAdd(false)} />
              <Surface elevation={0} style={styles.subjectContainer}>
                <TextInput
                  dense={true}
                  style={styles.subjectInput}
                  autoCapitalize={false}
                  underlineStyle={styles.inputUnderline}
                  placeholder={state.strings.subjectOptional}
                  left={<TextInput.Icon style={styles.icon} icon="label-outline" />}
                  value={subjectTopic}
                  onChangeText={value => setSubjectTopic(value)}
                />
                <Divider style={styles.modalDivider} />
              </Surface>
              <View style={styles.membersContainer}>
                <Divider style={styles.modalDivider} />
                <Surface elevation={0} mode="flat" style={styles.members}>
                  <FlatList
                    style={styles.cards}
                    data={cards}
                    initialNumToRender={32}
                    renderItem={({item}) => {
                      const enable = (
                        <Switch
                          key="enable"
                          style={styles.memberSwitch}
                          value={Boolean(members.find(cardId => cardId === item.cardId))}
                          onValueChange={flag => {
                            if (flag) {
                              setMembers([item.cardId, ...members]);
                            } else {
                              setMembers(members.filter(cardId => cardId !== item.cardId));
                            }
                          }}
                        />
                      );
                      return (
                        <Card
                          containerStyle={{
                            ...styles.card,
                            borderColor: theme.colors.outlineVariant,
                          }}
                          imageUrl={item.imageUrl}
                          name={item.name}
                          handle={item.handle}
                          node={item.node}
                          placeholder={state.strings.name}
                          actions={[enable]}
                        />
                      );
                    }}
                    keyExtractor={card => card.cardId}
                  />
                </Surface>
                <Divider style={styles.modalDivider} />
              </View>
              <View style={styles.addControls}>
                <View style={styles.sealable}>
                  {state.sealSet && (
                    <View style={styles.sealableContent}>
                      <Text style={styles.switchLabel}>{state.strings.sealedTopic}</Text>
                      <Switch style={styles.sealSwitch} value={sealedTopic} onValueChange={flag => setSealedTopic(flag)} />
                    </View>
                  )}
                </View>
                <Button mode="outlined" onPress={() => setAdd(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={adding} onPress={addTopic}>
                  {state.strings.create}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Confirm show={alert} params={alertParams} />
      <Selector share={share} selected={select} channels={state.channels} />
    </View>
  );
}
