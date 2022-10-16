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
    fontSize: 11,
    paddingTop: 2,
    color: Colors.grey,
  },
  carousel: {
    paddingLeft: 52,
    marginTop: 4,
    marginBottom: 4, 
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  status: {
    paddingLeft: 52,
  },
})

