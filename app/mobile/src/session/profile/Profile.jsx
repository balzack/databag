import { useContext } from 'react';
import { Alert, ScrollView, View, Switch, TouchableOpacity, Text } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function Profile() {

  const { state, actions } = useProfile();

  const setVisible = async (visible) => {
    try {
      await actions.setVisible(visible);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Account Update Failed',
        'Please try again.'
      );
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <Text style={styles.headerText}>{ `${state.handle}@${state.node}` }</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ width: 128 }}>
        <Logo src={state.imageSource} width={128} height={128} radius={8} />
        <View style={styles.edit}>
          <Ionicons name="edit" size={14} color={Colors.white} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.detail}>
        <View style={styles.attribute}>
          <Text style={styles.nametext}>{ state.name }</Text>
          <Ionicons name="edit" size={16} color={Colors.text} />
        </View>
        <View style={styles.attribute}>
          <Ionicons name="enviromento" size={14} color={Colors.text} />
          <Text style={styles.locationtext}>{ state.location }</Text>
        </View> 
        <View style={styles.attribute}>
          <Ionicons name="book" size={14} color={Colors.text} />
          <Text style={styles.descriptiontext}>{ state.description }</Text>
        </View> 
      </TouchableOpacity>
      <View style={styles.visible}>
        <Text style={styles.visibleText}>Visible in Registry</Text>
        <Switch style={styles.visibleSwitch} value={state.searchable} onValueChange={setVisible} />
      </View>
      <TouchableOpacity style={styles.logout} onPress={actions.logout}>
        <Ionicons name="logout" size={14} color={Colors.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

