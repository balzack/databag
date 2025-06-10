import {useState} from 'react';
import {SafeAreaView, Pressable, View, FlatList} from 'react-native';
import {Text, IconButton, Divider, Icon, TextInput, Surface, useTheme} from 'react-native-paper';
import {ContactParams} from '../profile/Profile';
import {styles} from './Registry.styled';
import {useRegistry} from './useRegistry.hook';
import {Card} from '../card/Card';

export function Registry({close, openContact}: {close?: () => void; openContact: (params: ContactParams) => void}) {
  const [search, setSearch] = useState(true);
  const {state, actions} = useRegistry();
  const theme = useTheme();

  return (
    <View style={styles.component}>
      { state.layout === 'small' && (
        <View style={styles.registry}>
          <Surface elevation={9} mode="flat" style={{ width: '100%', height: 72, display: 'flex', flexDirection: 'row', paddingLeft: 8, paddingBottom: 16, paddingRight: 16, alignItems: 'center', gap: 16 }}>
            <Pressable style={styles.navIcon} onPress={close}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>

            <Surface mode="flat" elevation={0} style={{ flexGrow: 1, borderRadius: 8, overflow: 'hidden' }}>
              { !search && (
                <TextInput
                  dense={true}
                  style={styles.input}
                  outlineStyle={styles.inputBorder}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  mode="outlined"
                  placeholder={state.strings.node}
                  left={<TextInput.Icon style={styles.icon} icon="server" />}
                  right={<TextInput.Icon style={styles.icon} icon="filter" onPress={() => setSearch(true)} />}
                  value={state.server}
                  onChangeText={value => actions.setServer(value)}
                />
              )}
              { search && (
                <TextInput
                  dense={true}
                  style={styles.input}
                  outlineStyle={styles.inputBorder}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  mode="outlined"
                  placeholder={state.strings.username}
                  left={<TextInput.Icon style={styles.icon} icon="filter" />}
                  right={<TextInput.Icon style={styles.icon} icon="server" onPress={() => setSearch(false)} />}
                  value={state.username}
                  onChangeText={value => actions.setUsername(value)}
                />
              )}
            </Surface>
          </Surface>

          {state.contacts.length !== 0 && (
            <FlatList
              style={styles.smCards}
              data={state.contacts}
              initialNumToRender={32}
              contentContainerStyle={{ paddingBottom: 128 }}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const select = () => {
                  const {guid, handle, node, name, location, description, imageUrl} = item;
                  const params = {
                    guid,
                    handle,
                    node,
                    name,
                    location,
                    description,
                    imageUrl,
                  };
                  openContact(params);
                };
                return (
                  <Card
                    containerStyle={styles.smCard}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    handle={item.handle}
                    node={item.node}
                    placeholder={state.strings.name}
                    select={select}
                    actions={[]}
                  />
                );
              }}
              keyExtractor={profile => profile.guid}
            />
          )}
          {state.contacts.length === 0 && (
            <View style={styles.none}>
              <Text style={styles.noneLabel}>{state.strings.noContacts}</Text>
            </View>
          )}

        </View>
      )}
      { state.layout === 'large' && (
        <View style={styles.registry}>
          <SafeAreaView style={styles.header}>
            {close && <IconButton style={styles.close} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />}
            <Surface mode="flat" style={styles.inputUsername} elevation={5}>
              <TextInput
                dense={true}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                placeholder={state.strings.username}
                left={<TextInput.Icon style={styles.icon} icon="account" />}
                value={state.username}
                onChangeText={value => actions.setUsername(value)}
              />
            </Surface>
            <Surface mode="flat" style={styles.inputServer} elevation={5}>
              <TextInput
                dense={true}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                placeholder={state.strings.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                value={state.server}
                onChangeText={value => actions.setServer(value)}
              />
            </Surface>
          </SafeAreaView>
          <Divider style={styles.divider} />

          {state.contacts.length !== 0 && (
            <FlatList
              style={styles.cards}
              data={state.contacts}
              initialNumToRender={32}
              contentContainerStyle={state.layout === 'large' ? styles.cardsContainer : {}}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const select = () => {
                  const {guid, handle, node, name, location, description, imageUrl} = item;
                  const params = {
                    guid,
                    handle,
                    node,
                    name,
                    location,
                    description,
                    imageUrl,
                  };
                  openContact(params);
                };
                return (
                  <Card
                    containerStyle={{
                      ...styles.card,
                      borderColor: theme.colors.outlineVariant,
                    }}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    handle={item.handle}
                    node={item.node}
                    placeholder={state.strings.name}
                    select={select}
                    actions={[]}
                  />
                );
              }}
              keyExtractor={profile => profile.guid}
            />
          )}
          {state.contacts.length === 0 && (
            <View style={styles.none}>
              <Text style={styles.noneLabel}>{state.strings.noContacts}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
