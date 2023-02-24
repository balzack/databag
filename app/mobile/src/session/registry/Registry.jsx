import { useContext, useState, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Registry.styled';
import { useRegistry } from './useRegistry.hook';
import { RegistryItem } from './registryItem/RegistryItem';
import { ProfileContext } from 'context/ProfileContext';
import Colors from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';

export function RegistryHeader({ search, setSearch, handle, setHandle, server, setServer }) {

  return (
    <View style={styles.title}>
      <View style={styles.inputwrapper}>
        <TextInput style={styles.inputfield} value={server} onChangeText={setServer}
            autoCorrect={false} autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Server" />
      </View>
      { !search && (
        <TouchableOpacity style={styles.sort} onPress={() => setSearch(true)}>
          <Ionicons style={styles.icon} name="filter" size={18} color={Colors.disabled} />
        </TouchableOpacity>
      )}
      { search && (
        <View style={styles.filterwrapper}>
          <TextInput style={styles.inputfield} value={handle} onChangeText={setHandle}
              autoCorrect={false} autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Username" />
        </View>
      )}
    </View>
  );
}

export function RegistryBody({ search, handle, server, openContact }) {
  const { state, actions } = useRegistry(search, handle, server);

  return (
    <View style={styles.accounts}>
      { state.searching && (
        <View style={styles.empty}>
          <ActivityIndicator size={'large'} color={Colors.backgrougd} />
        </View>
      )}
      { !state.searching && state.accounts.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No Contacts Found</Text>
        </View>
      )}
      { !state.searching && state.accounts.length !== 0 && (
        <FlatList
          data={state.accounts}
          renderItem={({ item }) => <RegistryItem item={item} openContact={openContact} />}
          keyExtractor={item => item.guid}
        />
      )}
    </View>
  );
}

export function Registry({ closeRegistry, openContact }) {
  const [search, setSearch] = useState(false);
  const [handle, setHandle] = useState();
  const [server, setServer] = useState();
  const profile = useContext(ProfileContext);

  useEffect(() => {
    setSearch(false);
    setHandle(null);
    setServer(profile.state.identity?.node);
  }, [profile.state]);

  return (
    <View>
      <RegistryHeader search={search} setSearch={setSearch} handle={handle} setHandle={setHandle} server={server} setServer={setServer} />
      <RegistryBody search={search} handle={handle} server={server} openContact={openContact} />
    </View>
  );
}

