import { useContext } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Registry.styled';
import { useRegistry } from './useRegistry.hook';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/AntDesign';
import { RegistryItem } from './registryItem/RegistryItem';
import Colors from 'constants/Colors';

export function RegistryTitle({ state, actions }) {

  const search = async () => {
    try {
      await actions.search();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Server Listing Failed',
        'Please try again.'
      );
    }
  }

  return (
    <View style={styles.title}>
      <View style={styles.inputwrapper}>
        <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
            autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Server" />
        <View style={styles.space} />
      </View>
      { state.busy && (
        <View style={styles.search}>
          <ActivityIndicator />
        </View>
      )}
      { !state.busy && (
        <TouchableOpacity style={styles.search} onPress={search}>
          <Ionicons name={'search1'} size={16} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function RegistryBody({ state, actions, openContact }) {
  return (
    <FlatList style={styles.accounts}
      data={state.accounts}
      renderItem={({ item }) => <RegistryItem item={item} openContact={openContact} />}
      keyExtractor={item => item.guid}
    />
  );
}


export function Registry({ closeRegistry, openContact }) {

  const search = async () => {
    try {
      await actions.search();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Server Listing Failed',
        'Please try again.'
      );
    }
  }

  const { state, actions } = useRegistry();
  return (
    <View style={styles.container}>
      { state.tabbed && (
        <>
          <View style={styles.topbar}>
            { state.busy && (
              <View style={styles.search}>
                <ActivityIndicator />
              </View>
            )}
            { !state.busy && (
              <TouchableOpacity style={styles.search} onPress={search}>
                <Ionicons name={'search1'} size={16} color={Colors.white} />
              </TouchableOpacity>
            )}
            <View style={styles.inputwrapper}>
              <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                  autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Server" />
              <View style={styles.space} />
            </View>
            <TouchableOpacity style={styles.close} onPress={closeRegistry}>
              <Ionicons name={'close'} size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList style={styles.accounts}
            data={state.accounts}
            renderItem={({ item }) => <RegistryItem item={item} openContact={openContact} />}
            keyExtractor={item => item.guid}
          />
        </>
      )}
      { !state.tabbed && (
        <SafeAreaView edges={['right']}>
          <View style={styles.searcharea}>
            <View style={styles.searchbar}>
              { state.busy && (
                <View style={styles.search}>
                  <ActivityIndicator />
                </View>
              )}
              { !state.busy && (
                <TouchableOpacity style={styles.search} onPress={search}>
                  <Ionicons name={'search1'} size={16} color={Colors.white} />
                </TouchableOpacity>
              )}
              <View style={styles.inputwrapper}>
                <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                    autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Server" />
              </View>
            </View>
          </View>
          <FlatList style={styles.accounts}
            data={state.accounts}
            renderItem={({ item }) => <RegistryItem item={item} openContact={openContact} />}
            keyExtractor={item => item.guid}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

