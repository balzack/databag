import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  requested: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  offsync: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.alert,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
