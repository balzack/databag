import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    paddingLeft: 16,
    paddingRight: 16,
  },
  active: {
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.background,
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 1,
  },
  subject: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 1,
  },
  subjectIcon: {
    paddingRight: 4,
  },
  subjectText: {
    color: Colors.text,
    fontSize: 14,
  },
  message: {
    color: Colors.lightText,
    fontSize: 12,
  },
})
