import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  identity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  identityData: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  anchor: {
    backgroundColor: 'red',
    width: 1,
    height: 1,
  },
  titleStyle: {
    fontSize: 20,
  },
  image: {
    position: 'relative',
    width: 64,
    height: 64,
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
    paddingLeft: 16,
    paddingRight: 8,
    width: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
  },
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
  container: {
    width: 600,
    maxWidth: '80%',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    gap: 8,
  },
  surface: {
    padding: 16,
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalLabel: {
    fontSize: 20,
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  allControl: {
    flexShrink: 1,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  modalControls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
  },
  controlLabel: {
    fontSize: 16,
  },
  controlSwitch: {
    transform: [{scaleX: 0.7}, {scaleY: 0.7}],
  },
});
