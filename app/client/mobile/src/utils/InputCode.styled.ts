import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 32,
    height: '100%',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#dddddd',
    borderColor: '#aaaaaa',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  input: {
    width: '100%',
    height: '100%',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    fontSize: 20,
  },
});
