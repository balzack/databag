import { useState } from 'react';
import { TouchableOpacity, SafeAreaView, View, Image } from 'react-native';
import { Icon, Text, Menu } from 'react-native-paper';
import { styles } from './Identity.styled';
import { useIdentity } from './useIdentity.hook';

export function Identity({ openSettings }) {
  const [menu, setMenu] = useState(false);
  const { state, actions } = useIdentity();

  return (
    <SafeAreaView style={styles.identity}>
      <TouchableOpacity style={styles.identityData} activeOpacity={1} onPress={() => setMenu(true)}>
        <View style={styles.image}>
          {state.profile.imageSet && (
            <Image style={styles.logoSet} resizeMode={'contain'} source={state.imageUrl} />
          )}
          {!state.profile.imageSet && (
            <Image style={styles.logoUnset} resizeMode={'contain'} source={state.imageUrl} />
          )}
        </View>
        <View style={styles.details}>
          {state.profile.name && (
            <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{state.profile.name}</Text>
          )}
          <Text style={styles.username} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>        
        </View>
        <Icon size={18} source="chevron-right" />
      </TouchableOpacity>
      <Menu
        visible={menu}
        onDismiss={() => setMenu(false)}
        anchorPosition="top"
        anchor={<View style={styles.anchor}><Text> </Text></View>}>
        <Menu.Item leadingIcon="cog-outline" onPress={() => {setMenu(false); openSettings()}} title={state.strings.settings} />
        <Menu.Item leadingIcon="contacts-outline" onPress={() => {}} title={state.strings.contacts} />
        <Menu.Item leadingIcon="logout" onPress={() => {}} title={state.strings.logout} />
      </Menu>
    </SafeAreaView>
  )
}
