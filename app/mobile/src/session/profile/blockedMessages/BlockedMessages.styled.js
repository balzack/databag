import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    fontSize: 14,
    height: 200,
  },
  default: {
    textAlign: 'center',
    color: Colors.grey,
  },
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 32,
    paddingLeft: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  name: {
    color: Colors.text,
    fontSize: 14,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  created: {
    color: Colors.text,
    fontSize: 12,
    paddingRight: 16,
  },
});
