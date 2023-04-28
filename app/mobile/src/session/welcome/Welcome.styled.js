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
    marginBottom: 16,
    opacity: 0.3,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 16,
    color: Colors.text,
  },
  label: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingBottom: 16,
    color: Colors.text,
  },
  message: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    textAlign: 'center',
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    flexDirection: 'row',
  },
  stepstext: {
    color: Colors.text,
    padding: 8,
  },
});

