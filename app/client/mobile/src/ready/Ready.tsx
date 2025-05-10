import React from 'react';
import {View, SafeAreaView, Image} from 'react-native';
import {styles} from './Ready.styled';
import {useReady} from './useReady.hook';
import typer from '../images/typer.png';
import {useTheme, Surface, Button, Text, Icon} from 'react-native-paper';
import {Colors} from '../constants/Colors';

export function Ready() {
  const {state, actions} = useReady();

  return (
    <Surface style={styles.full} elevation={9}>
      <View style={styles.frame}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleSmall">{ state.strings.startTopic }</Text>
            </View>
              <Text variant="labelLarge" style={styles.info}>{ state.strings.moreContacts }</Text>
            <Button mode="contained" style={styles.submit} onPress={actions.done}>
              {state.strings.continue}
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </Surface>
  );
}
