import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    maxWidth: 500,
    width: '80%',
    gap: 8,
  },
  surface: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    width: '100%',
    fontWeight: 'bold',
  },
  prompt: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  control: {
    flex: 1,
    borderRadius: 8,
  },
});
