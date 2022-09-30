import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  add: {
    borderTopWidth: 1,
    borderColor: Colors.divider,
    display: 'flex',
    flexDirection: 'column',
  },
  addButtons: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 2,
  },
  input: {
    margin: 8,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
    maxHeight: 96,
    minHeight: 48,
  },
  space: {
    borderWidth: 1,
    borderColor: Colors.divider,
    height: 32,
    marginLeft: 8,
    marginRight: 8,
  },
})

