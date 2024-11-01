import React from 'react';
import {Divider, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {Colors} from '../constants/Colors';
import {useContent} from './useContent.hook';

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
            contentContainerStyle={styles.channelContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <Text>CHANNEL ITEM</Text>
              );
            }}
            keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
          />
        )}
        {state.filtered.length === 0 && <Text style={styles.none}>{state.strings.noTopics}</Text>}
      </View>
      { state.layout === 'large' && (
        <View style={styles.bar}>
          <Text>BAR</Text>
        </View>
      )}
    </View>
  );
}
