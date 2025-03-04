import React, {ReactNode} from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './Card.styled';

export function Card({
  imageUrl,
  name,
  placeholder,
  handle,
  node,
  select,
  actions,
  containerStyle,
}: {
  containerStyle: any;
  imageUrl: string;
  name: string;
  placeholder: string;
  handle: string;
  node: string;
  select?: () => void;
  actions: ReactNode[];
}) {
  return (
    <Pressable style={containerStyle} onPress={select ? select : () => {}}>
      <SafeAreaView style={styles.card}>
        <Image style={styles.image} resizeMode={'contain'} source={{uri: imageUrl}} />
        <View style={styles.details}>
          {name && (
            <Text numberOfLines={1} style={styles.nameSet}>
              {name}
            </Text>
          )}
          {!name && (
            <Text numberOfLines={1} style={styles.nameUnset}>
              {placeholder}
            </Text>
          )}
          <Text numberOfLines={1} style={styles.handle}>
            {node ? `${handle}@${node}` : handle}
          </Text>
        </View>
        <View style={styles.actions}>{actions}</View>
      </SafeAreaView>
    </Pressable>
  );
}
