import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputwrapper: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Colors.lightgrey,
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8,
  },
  inputfield: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    color: Colors.white,
    fontSize: 16,
  },
  icon: {
    paddingLeft: 8,
  }  
})

