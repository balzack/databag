import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  channel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  messageSet: {
    fontSize: 12,
    textWrap: 'nowrap',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  messageUnset: {
    fontSize: 12,
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: Colors.placeholder,
    fontStyle: 'italic',    
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  subject: {
    fontSize: 14,
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: 1,
  },
  unknown: {
    color: Colors.placeholder,
    fontStyle: 'italic',
  },
  known: {
    fontWeight: 'bold',
  },
  notes: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  unread: {
    width: 8,
    height: 8,
    backgroundColor: Colors.connected,
    borderRadius: 2,
  },
});
