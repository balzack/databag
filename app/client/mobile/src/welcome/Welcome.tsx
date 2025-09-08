import React, {useEffect} from 'react';
import {useAnimatedValue, Animated, View, SafeAreaView, Image} from 'react-native';
import {styles} from './Welcome.styled';
import {useWelcome} from './useWelcome.hook';
import typer from '../images/typer.png';
import {Surface, Button, Text, Icon} from 'react-native-paper';
import {Colors} from '../constants/Colors';

export function Welcome({next}: {next: () => void}) {
  const {state} = useWelcome();
  const show = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(show, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Surface elevation={9}>
      <Animated.View style={[styles.full, {opacity: show}]}>
        <View style={styles.splash}>
          <Image style={styles.typer} source={typer} resizeMode="contain" />
        </View>
        <View style={styles.frame}>
          <View style={styles.wrapper}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.title} variant="titleMedium">
                  {state.strings.welcomeTo}
                </Text>
              </View>
              <View style={styles.header}>
                <Text style={styles.headline} variant="headlineMedium">
                  {state.strings.communication}
                </Text>
              </View>
            </View>
            <View style={styles.detail}>
              <View style={styles.steps}>
                <View style={styles.step}>
                  <Icon size={24} source="user" color={Colors.icon} />
                  <Text variant="labelLarge">{state.strings.yourProfile}</Text>
                </View>
                <View style={styles.step}>
                  <Icon size={24} source="rolodex" color={Colors.icon} />
                  <Text variant="labelLarge">{state.strings.connectWith}</Text>
                </View>
                <View style={styles.step}>
                  <Icon size={24} source="message-circle" color={Colors.icon} />
                  <Text variant="labelLarge">{state.strings.startTopic}</Text>
                </View>
              </View>
              <View style={styles.start}>
                <Button mode="contained" textColor="white" style={styles.submit} onPress={next}>
                  {state.strings.getStarted}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Surface>
  );
}
