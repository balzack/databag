import React from 'react';
import {Divider, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {Colors} from '../constants/Colors';
import {useContent} from './useContent.hook';
import {Channel} from '../channel/Channel';

export function Content() {
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
        { state.layout !== 'large' && (
          <Button icon="comment-plus" mode="contained" style={styles.button} onPress={() => {console.log("ADD CHANNEL")}}>
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
              const { sealed, hosted, unread, imageUrl, subject, message } = item;
              const select = () => {
                console.log('selected channel', item.cardId, item.channelId);
              }
              return (
                <Channel
                  containerStyle={{
                    ...styles.channel,
                    borderColor: theme.colors.outlineVariant,
                  }} select={select} unread={unread} sealed={sealed} hosted={hosted} imageUrl={imageUrl} notesPlaceholder={state.strings.notes} subjectPlaceholder={state.strings.unknown} subject={subject} messagePlaceholder={`[${state.strings.sealed}]`} message={message}  />
              );
            }}
            keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
          />
        )}
        {state.filtered.length === 0 && <Text style={styles.none}>{state.strings.noTopics}</Text>}
      </View>
      { state.layout === 'large' && (
        <View style={styles.bar}>
          <Divider style={styles.divider} />
          <Button icon="comment-plus" mode="contained" style={styles.button} onPress={() => {console.log("ADD CHANNEL")}}>
            {state.strings.new}
          </Button>
        </View>
      )}
    </View>
  );
}
