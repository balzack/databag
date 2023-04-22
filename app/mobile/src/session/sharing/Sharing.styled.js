import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  sharingBase: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  sharingFrame: {
    backgroundColor: Colors.formBackground,
    padding: 8,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
});

