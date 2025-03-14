import React from 'react'
import { View, Image } from 'react-native';
import { styles } from './Welcome.styled';
import { useWelcome } from './useWelcome.hook';
import light from '../images/lightness.png';
import dark from '../images/darkness.png';
import { useTheme, Button, Text, Icon} from 'react-native-paper';
import { Colors } from '../constants/Colors';

export function Welcome() {
  const theme = useTheme();
  const { state, actions } = useWelcome();

  return (
    <View style={ state.showWelcome ? styles.show : styles.hide }>
      <View style={{ ...styles.base, backgroundColor: theme.colors.base }}>
        <Text style={styles.title}>Databag</Text>
        <Text style={styles.description}>{ state.strings.communication }</Text>
        <Image style={styles.image} source={theme.colors.name == 'light' ? light : dark} resizeMode="contain" />
        <View style={styles.steps}>
          <View style={styles.step}>
            <Icon size={18} source="chevron-right" color={Colors.placeholder} />
            <Text style={styles.label}>{ state.strings.setupProfile }</Text>
          </View>
          <View style={styles.step}>
            <Icon size={18} source="chevron-right" color={Colors.placeholder} />
            <Text style={styles.label}>{ state.strings.connectPeople }</Text>
          </View>
          <View style={styles.step}>
            <Icon size={18} source="chevron-right" color={Colors.placeholder} />
            <Text style={styles.label}>{ state.strings.startConversation }</Text>
          </View>
        </View>
        <Button mode="contained" style={styles.button} onPress={actions.clearWelcome}>
          {state.strings.continue}
        </Button>
      </View>
    </View>
  );
}

