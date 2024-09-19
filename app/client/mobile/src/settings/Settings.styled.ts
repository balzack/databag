import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  settings: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    marginTop: 16,
    marginBottom: 8,
  },
  logo: {
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 8,
    width: null,
    height: null,
  },
  editDetails: {
    fontSize: 18,
  },
  editBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setLogo: {
    fontSize: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888888'
  },
  unsetLogo: {
    color: '#888888',
    fontSize: 18,
  },
  editDivider: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  divider: {
    flexGrow: 1,
  },
  nameSet: {
    fontSize: 28,
    width: '100%',
    paddingLeft: 32,
    paddingRight: 32,
  },
  nameUnset: {
    fontSize: 28,
    width: '100%',
    paddingLeft: 32,
    paddingRight: 32,
    fontStyle: 'italic',
  },
  attributes: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
  attribute: {
    display: 'flex',
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  icon: {
    width: 32,
    display: 'flex',
    justifyContent: 'center',
  },
  labelUnset: {
    fontSize: 18,
    fontStyle: 'italic',
    flexGrow: 1,
  },
  labelSet: {
    fontSize: 18,
    flexGrow: 1,
  },
})
