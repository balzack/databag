import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export const styles = StyleSheet.create({
  callBase: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  callFrame: {
    backgroundColor: Colors.contentBase,
    padding: 8,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  callEnd: {
    position: 'absolute',
    bottom: 16,
    borderRadius: 24,
    borderColor: Colors.white,
    borderWidth: 1,
    padding: 8,
    backgroundColor: Colors.alert,
  },
  callLogo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  callOptions: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
  },
  callOption: {
    borderRadius: 24,
    borderColor: Colors.white,
    borderWidth: 1,
    padding: 8,
    backgroundColor: Colors.primary,
    marginLeft: 16,
    marginRight: 16,
  },
  callRemote: {
    width: '100%',
    height: '100%',
  },
  callLocal: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    height: '33%',
    width: '33%',
  },
});

