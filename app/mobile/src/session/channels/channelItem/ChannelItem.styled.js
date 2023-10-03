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
  active: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.itemDivider,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.areaBase,
  },
  detail: {
    paddingLeft: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  subject: {
    display: 'flex',
    flexDirection: 'row',
  },
  subjectIcon: {
    paddingRight: 4,
  },
  subjectText: {
    color: Colors.text,
    fontSize: 16,
  },
  message: {
    color: Colors.disabled,
    fontSize: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background,
  }
})
