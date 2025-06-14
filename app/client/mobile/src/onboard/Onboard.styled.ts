import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  show: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  hide: {
    display: 'none',
  },
  image: {
    width: '50%',
    height: '50%',
  },
  title: {
    fontSize: 24,
  },
  description: {
    fontSize: 16,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingTop: 16,
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    align: 'center',
  },
  label: {
    fontSize: 18,
  },
  button: {
    borderRadius: 8,
    fontSize: 18,
    marginTop: 32,
  },
});
