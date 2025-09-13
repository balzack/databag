import React from 'react';
import {View, Image} from 'react-native';
import {useTheme, Text, Icon} from 'react-native-paper';
import {styles} from './Base.styled';
import typer from '../images/typer.png';
import dark from '../images/darkness.png';
import light from '../images/lightness.png';
import {useBase} from './useBase.hook';
import {Colors} from '../constants/Colors';

export function Base() {
  const theme = useTheme();
  const {state} = useBase();

  return (
    <View style={{...styles.base, backgroundColor: theme.colors.base}}>
      <Image style={styles.image} source={typer} resizeMode="contain" />
    </View>
  );
}
