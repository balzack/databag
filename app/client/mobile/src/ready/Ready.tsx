import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {styles} from './Ready.styled';
import {useReady} from './useReady.hook';
import {Surface, Button, Text} from 'react-native-paper';

export function Ready() {
  const {state, actions} = useReady();

  return (
    <Surface style={styles.full} elevation={9}>
      <View style={styles.frame}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleSmall">{state.strings.allDone}</Text>
            </View>
            <Text variant="labelLarge" style={styles.info}>
              {state.strings.moreContacts}
            </Text>
            <Button mode="contained" textColor="white" style={styles.submit} onPress={actions.done}>
              {state.strings.continue}
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </Surface>
  );
}
