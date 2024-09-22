import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  identity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-begin',
  },
  identityData: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  anchor: {
    backgroundColor: 'red',
    width: 1,
    height: 1,
  },
  image: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  logoUnset: {
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 4,
    width: null,
    height: null,
    borderWidth: 1,
    borderColor: '#888888',
  },
  logoSet: {
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 4,
    width: null,
    height: null,
  },
  details: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    width: 100,
  },
  name: {
    fontSize: 14,
  },
  username: {
    fontSize: 16,
  },
});
