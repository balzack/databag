import React from 'react';
import {Divider, Surface, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {useContent} from './useContent.hook';
import {Channel} from '../channel/Channel';
import {Focus} from 'databag-client-sdk';

export function Content({select}: {select: (focus: Focus) => void}) {
  const {state, actions} = useContent();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Surface mode="flat" style={styles.inputSurface}>
          <TextInput
            dense={true}
            style={styles.input}
            autoCapitalize={false}
            unserlineStyle={styles.inputUnderline}
            mode="outlined"
            placeholder={state.strings.topics}
            left={<TextInput.Icon style={styles.icon} icon="magnify" />}
            value={state.filter}
            onChangeText={value => actions.setFilter(value)}
          />
        </Surface>
        {state.layout !== 'large' && (
          <Button
            icon="comment-plus"
            mode="contained"
            style={styles.button}
            onPress={() => {
              console.log('ADD CHANNEL');
            }}>
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
              const {sealed, hosted, unread, imageUrl, subject, message} = item;
              const open = () => {
                const focus = actions.getFocus(item.cardId, item.channelId);
                select(focus);
              };
              return (
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
          <Button
            icon="comment-plus"
            mode="contained"
            style={styles.button}
            onPress={() => {
              console.log('ADD CHANNEL');
            }}>
            {state.strings.new}
          </Button>
        </View>
      )}
    </View>
  );
}
