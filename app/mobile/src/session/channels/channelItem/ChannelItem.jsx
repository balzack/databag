import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Logo } from 'utils/Logo';
import { styles } from './ChannelItem.styled';

export function ChannelItem({ item }) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <Logo src={item.logo} width={40} height={40} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.subject} numberOfLines={1} ellipsizeMode={'tail'}>{ item.subject }</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode={'tail'}>{ item.message }</Text>
      </View>
    </TouchableOpacity>
  )
}

export const MemoizedChannelItem = React.memo(ChannelItem);
