import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeftWidth: 1,
    borderColor: Colors.divider,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    padding: 8,
  },
  body: {
    width: '100%',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subject: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
    textAlign: 'center',
    paddingLeft: 16,
  },
  subjectText: {
    fontSize: 18,
    textAlign: 'center',
  },
  action: {
    paddingLeft: 8,
  },
  topics: {
    height: '100%',
  },
})

