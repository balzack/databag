
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
  },
  headertitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
  }, 
  titletext: {
    fontSize: 18,
    paddingLeft: 16,
    paddingRight: 16,
  },
  titlebutton: {
    paddingRight: 16,
  },
  headerclose: {
    flexGrow: 1,
    alignItems: 'flex-end',
    paddingTop: 8,
  },
});

