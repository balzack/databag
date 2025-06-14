import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  flair: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cursor: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    height: '100%',
    gap: 4,
  },
  nocursor: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    height: '100%',
    gap: 4,
    cursor: 'default',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  nameSet: {
    fontSize: 16,
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 700,
  },
  nameUnset: {
    fontSize: 16,
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontStyle: 'italic',
    color: Colors.placeholder,
  },
  handle: {
    fontSize: 14,
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 'bold',
    paddingTop: 4,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
  },
});
