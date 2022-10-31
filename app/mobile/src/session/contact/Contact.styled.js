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
    backgroundColor: Colors.formBackground,
  },
  wrapper: {
    backgroundColor: Colors.formBackground,
  },
  title: {
    fontSize: 18,
  },
  resync: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    paddingTop: 2,
  },
  icon: {
    width: 32,
    paddingLeft: 8
  },
  drawer: {
    paddingTop: 16,
  },
  close: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    paddingRight: 32,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  status: {
    color: Colors.grey,
    paddingBottom: 20,
    paddingTop: 4, 
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
    paddingLeft: 32,
    paddingRight: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: Colors.text,
  },
  attribute: {
    display: 'flex',
    flexDirection: 'row',
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
  button: {
    width: 192,
    padding: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.white,
  },
})

