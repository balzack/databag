import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  settings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    gap: 2,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  image: {
    position: 'relative',
    width: '90%',
    maxWidth: 250,
    marginTop: 8,
    marginBottom: 24,
  },
  logo: {
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 8,
    width: null,
    height: null,
  },
  editBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editLogo: {
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: '#44444444',
  },
})
