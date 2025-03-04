import React from 'react'
import { View, Image } from 'react-native';
import {useTheme, Text, Icon} from 'react-native-paper';
import { styles } from './Base.styled';
import dark from '../images/darkness.png';
import light from '../images/lightness.png';
import { useBase } from './useBase.hook';
import { Colors } from '../constants/Colors';

export function Base() {
  const theme = useTheme();
  const { state, actions } = useBase();

  return (
    <View style={{ ...styles.base, backgroundColor: theme.colors.base }}>
      <Text style={styles.title}>Databag</Text>
      <Text style={styles.description}>{ state.strings.communication }</Text>
      <Image style={styles.image} source={theme.colors.name == 'light' ? light : dark} resizeMode="contain" />
      { (state.profileSet === false || state.cardSet === false || state.channelSet === false) && (
        <View style={styles.steps}>
          { state.profileSet === false && (
            <Text style={styles.step}>{ state.strings.setupProfile }</Text>
          )}
          <Icon size={14} source="chevron-right" color={Colors.placeholder} />
          { (state.profileSet === false || state.cardSet === false) && (
            <Text style={styles.step}>{ state.strings.connectPeople }</Text>
          )}
          <Icon size={14} source="chevron-right" color={Colors.placeholder} />
          <Text style={styles.step}>{ state.strings.startConversation }</Text>
        </View>
      )}
    </View>
  );
}

