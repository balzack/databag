import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.background,
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    flexGrow: 1,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  label: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
  },
  message: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    textAlign: 'center',
  }, 
});

