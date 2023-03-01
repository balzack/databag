
import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
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
  },
  headerclose: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
});

