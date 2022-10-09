import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  info: {
    paddingLeft: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  subject: {
    fontSize: 18,
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 8,
    color: Colors.text,
  },
  created: {
    fontSize: 16,
    color: Colors.text,
  },
  mode: {
    fontSize: 16,
    color: Colors.text,
  },
  title: {
    fontSize: 20,
  }
})

