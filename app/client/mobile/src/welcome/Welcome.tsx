import React from 'react';
import {View, SafeAreaView, Image} from 'react-native';
import {styles} from './Welcome.styled';
import {useWelcome} from './useWelcome.hook';
import typer from '../images/typer.png';
import {useTheme, Surface, Button, Text, Icon} from 'react-native-paper';
import {Colors} from '../constants/Colors';

export function Welcome({ next }: { next: ()=>void }) {
  const {state, actions} = useWelcome();

  return (
    <Surface style={styles.full} elevation={9}>
      <View style={styles.splash}>
        <Image style={styles.typer} source={typer} resizeMode="contain" />
      </View>
      <View style={styles.frame}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleLarge">
                Databag
              </Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.headline} variant="titleSmall">{ state.strings.communication }</Text>
            </View>
          </View>
          <View style={styles.detail}>
            <View style={styles.steps}>
              <View style={styles.step}>
                <Icon size={24} source="user" color={Colors.icon} />
                <Text variant="labelLarge">{ state.strings.yourProfile }</Text>
              </View>
              <View style={styles.step}>
                <Icon size={24} source="contacts" color={Colors.icon} />
                <Text variant="labelLarge">{ state.strings.connectPeople }</Text>
              </View>
              <View style={styles.step}>
                <Icon size={24} source="message-circle" color={Colors.icon} />
                <Text variant="labelLarge">{ state.strings.startTopic }</Text>
              </View>
              <Button mode="contained" style={styles.submit} onPress={next}>
                {state.strings.getStarted}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Surface>
  );
}
