import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    paddingLeft: 16,
    paddingRight: 16,
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  space: {
    height: 64,
  },
  name: {
    color: Colors.text,
    fontSize: 14,
  },
  handle: {
    color: Colors.text,
    fontSize: 12,
  },
  track: {
    false: Colors.grey,
    true: Colors.background,
  },
  switch: {
    transform: [{ scaleX: .7 }, { scaleY: .7 }],
  },
});
