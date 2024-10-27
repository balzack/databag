import React, {ReactNode} from 'react';
import {Image, View, Pressable} from 'react-native';
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
      <View style={styles.card}>
        <Image style={styles.image} resizeMode={'contain'} source={{uri: imageUrl}} />
        <View style={styles.details}>
          {name && <Text style={styles.nameSet}>{name}</Text>}
          {!name && <Text style={styles.nameUnset}>{placeholder}</Text>}
          <Text style={styles.handle}>{node ? `${handle}/${node}` : handle}</Text>
        </View>
        {actions}
      </View>
    </Pressable>
  );
}
