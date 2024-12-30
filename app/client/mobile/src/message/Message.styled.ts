import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  message: {
    paddingTop: 8,
    width: '100%',
  },
  topic: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 8,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flexStart',
    width: '100%',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 2,
    marginLeft: 8,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flexStart',
    width: '100%',
    lineHeight: '16',
    paddingBottom: '4',
    gap: '16',
    position: 'relative',
  },
  name: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  handle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unknown: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  locked: {
    fontStyle: 'italic',
    color: Colors.placeholder,
  },
  timestamp: {
    fontSize: 12,
  },
  padding: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
  },
})
