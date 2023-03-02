
import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    height: 48,
    marginLeft: 16,
    marginRight: 16,
  },
  headertitle: {
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
  }, 
  titletext: {
    fontSize: 18,
    flexShrink: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  titlebutton: {
    paddingRight: 8,
    width: 32,
  },
  headerclose: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  thread: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
  },
});

