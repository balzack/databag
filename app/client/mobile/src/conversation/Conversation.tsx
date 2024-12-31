import React, { useEffect, useState, useRef } from 'react';
import {SafeAreaView, View, FlatList, TouchableOpacity} from 'react-native';
import {styles} from './Conversation.styled';
import {useConversation} from './useConversation.hook';
import {Message} from '../message/Message';
import {Icon, Text, IconButton, Divider} from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';

const SCROLL_THRESHOLD = 16;

export type MediaAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export function Conversation({close}: {close: ()=>void}) {
  const { state, actions } = useConversation();
  const [ more, setMore ] = useState(false);
  const [ selected, setSelected ] = useState(null as null | string);
  const thread = useRef();

  const scrolled = useRef(false);
  const contentHeight = useRef(0);
  const contentLead = useRef(null);
  const scrollOffset = useRef(0);
 
  const loadMore = async () => {
    if (!more) {
      setMore(true);
      await actions.more();
      setMore(false);
    }
  }

  const onClose = () => {
    actions.close();
    close();
  }

  const onContent = (width, height) => {
    const currentLead = state.topics.length > 0 ? state.topics[0].topicId : null;
    if (scrolled.current) {
      if (currentLead !== contentLead.current) {
        const offset = scrollOffset.current + (height - contentHeight.current);
        const animated = false;
        thread.current.scrollToOffset({offset, animated});
      }
    }
    contentLead.current = currentLead;
    contentHeight.current = height;
  }

  const onScroll = (ev) => {
    const { contentOffset } = ev.nativeEvent;
    const offset = contentOffset.y;
    if (offset > scrollOffset.current) {
      if (offset > SCROLL_THRESHOLD) {
        scrolled.current = true;
      }
    } else {
      if (offset < SCROLL_THRESHOLD) {
        scrolled.current = false;
      }
    }
    scrollOffset.current = offset;
  }

  return (
    <View style={styles.conversation}>
      <SafeAreaView style={styles.header}>
        <IconButton style={styles.icon} compact="true" mode="contained" icon="arrow-left" size={28} onPress={onClose} />
        <View style={styles.title}>
          { state.detailSet && state.subject && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.subject }</Text>
          )}
          { state.detailSet && state.host && !state.subject && state.subjectNames.length == 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.strings.notes }</Text>
          )}
          { state.detailSet && !state.subject && state.subjectNames.length > 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.subjectNames.join(', ') }</Text>
          )}
          { state.detailSet && !state.subject && state.unknownContacts > 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.unknown}>{ `, ${state.strings.unknownContact} (${state.unknownContacts})` }</Text>
          )}
        </View>
        <IconButton style={styles.icon} compact="true" mode="contained" icon="cog-outline" size={28} onPress={()=>{}} />
      </SafeAreaView>
      <Divider style={styles.border} bold={true} />
      <View style={styles.thread}>
        <FlatList
          style={styles.messageList}
          inverted
          ref={thread}
          onScroll={onScroll}
          data={state.topics}
          initialNumToRender={32}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={onContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0}
          contentContainerStyle={styles.messages}
          renderItem={({item}) => {
            const { host } = state;
            const card = state.cards.get(item.guid) || null;
            const profile = state.profile?.guid === item.guid ? state.profile : null;
            return (
              <Message
                topic={item}
                card={card}
                profile={profile}
                host={host}
                select={(id)=>setSelected(id)}
                selected={selected}
              />
            )
          }}
          keyExtractor={topic => (topic.topicId)}
        />
        { state.loaded && state.topics.length === 0 && ( 
          <Text style={styles.empty}>{state.strings.noMessages}</Text>
        )} 
        { !state.loaded && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        { more && (
          <View style={styles.more}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <Divider style={styles.border} bold={true} />
      <TouchableOpacity style={styles.add} onPress={() => thread.current.scrollToEnd()}>
        <Text>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}
