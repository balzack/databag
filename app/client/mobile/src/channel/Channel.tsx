import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './Channel.styled';

export function Channel({
  containerStyle,
  unread,
  imageUrl,
  notesPlaceholder,
  subject,
  subjectPlaceholder,
  message,
  messagePlaceholder,
  select,
  action,
}: {
  containerStyle: any;
  unread: boolean;
  imageUrl: string;
  notesPlaceholder: string;
  subject: (string | null)[];
  subjectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  select?: () => void;
  action: ReactNode;
}) {
  const title = subject.length ? (
    subject.map((part, index) =>
      part ? (
        <Text key={index} style={{ ...styles.known, ...containerStyle.title }}>
          {part + (index + 1 < subject.length ? ', ' : '')}
        </Text>
      ) : (
        <Text key={index} style={styles.unknown}>
          {subjectPlaceholder + (index + 1 < subject.length ? ', ' : '')}
        </Text>
      ),
    )
  ) : (
    <Text style={styles.notes}>{notesPlaceholder}</Text>
  );

  return (
    <Pressable style={containerStyle} onPress={select ? select : () => {}}>
      <SafeAreaView style={styles.channel}>
        <Image style={{...styles.image, ...containerStyle.logo}} resizeMode={'contain'} source={{uri: imageUrl}} />
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.subject}>
            {title}
          </Text>
          {message != null && (
            <Text numberOfLines={1} style={{...styles.messageSet, ...containerStyle.message}}>
              {message}
            </Text>
          )}
          {message == null && <Text style={styles.messageUnset}>{messagePlaceholder}</Text>}
        </View>
        {unread && <View style={styles.unread} />}
        {action}
      </SafeAreaView>
    </Pressable>
  );
}
