import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingBottom: 32,
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    paddingRight: 4,
  },
  camera: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 8,
    backgroundColor: Colors.lightgrey,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  gallery: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    backgroundColor: Colors.lightgrey,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  detail: {
    paddingTop: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: Colors.text,
  },
  attribute: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  nametext: {
    fontSize: 18,
    paddingRight: 8,
    fontWeight: 'bold',
  },
  locationtext: {
    fontSize: 16,
    paddingLeft: 8,
  },
  descriptiontext: {
    fontSize: 16,
    paddingLeft: 8
  },
})

