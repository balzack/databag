import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.formBackground,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  headerLabel: {
    paddingLeft: 16,
    fontSize: 20,
    color: Colors.text,
  },
  icon: {
    color: Colors.primary,
    paddingLeft: 16,
  },
  end: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 32,
  },
  accounts: {
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  account: {
    width: '100%',
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  details: {
    paddingLeft: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    paddingTop: 8,
  },
  name: {
    fontSize: 14,
    color: Colors.text,
  },
  handle: {
    fontSize: 14,
    color: Colors.text,
  },
  control: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  delete: {
    color: Colors.alert,
    paddingLeft: 16,
  },
  unlock: {
    color: Colors.alert,
    paddingLeft: 16,
  },
  disable: {
    color: Colors.pending,
    paddingLeft: 16,
  },
});
