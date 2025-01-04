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
  },
  unknown: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  locked: {
    fontStyle: 'italic',
    color: Colors.placeholder,
  },
  text: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 8,
  },
  option: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  padding: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
  },
  carousel: {
    paddingLeft: 8,
    paddingBottom: 8,
  },
  assets: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  item: {
    width: 64,
    height: 64,
    backgroundColor: 'yellow',
  }
})