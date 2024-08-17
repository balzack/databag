import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const styles = StyleSheet.create({
  audio: {
    width: 92,
    height: 92,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginRight: 16,
    display: 'flex',
    alignItems: 'center',
  },
  image: { 
    width: 92,
    height: 92,
  },
  input: {
    position: 'absolute',
    maxHeight: 50,
    textAlign: 'center',
    padding: 4,
  }
})
