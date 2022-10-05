import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  item: {
    borderTopWidth: 1,
    borderColor: Colors.white,
    paddingTop: 8,
    paddingBottom: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  name: {
    paddingLeft: 8,
  },
  timestamp: {
    paddingLeft: 8,
  },
  message: {
    paddingLeft: 52,
  },
  carousel: {
    paddingLeft: 52,
    marginTop: 4,
    marginBottom: 4, 
  },
})

