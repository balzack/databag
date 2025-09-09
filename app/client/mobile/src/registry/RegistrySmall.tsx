import React, {useState} from 'react';
import {Pressable, View, FlatList} from 'react-native';
import {Text, Icon, TextInput, Surface} from 'react-native-paper';
import {ContactParams} from '../profile/Profile';
import {styles} from './Registry.styled';
import {useRegistry} from './useRegistry.hook';
import {Card} from '../card/Card';

type RegistrySmallProps = {
  close?: () => void;
  openContact: (params: ContactParams) => void;
};

export function RegistrySmall({close, openContact}: RegistrySmallProps) {
  const [search, setSearch] = useState(true);
  const {state, actions} = useRegistry();

  return (
    <View style={styles.component}>
      <View style={styles.registry}>
        <Surface elevation={9} mode="flat" style={styles.headerSurface}>
          <Pressable style={styles.navIcon} onPress={close}>
            <Icon size={32} source="left" color={'white'} />
          </Pressable>

          <Surface mode="flat" elevation={0} style={styles.inputContainer}>
            {!search && (
              <TextInput
                dense={true}
                style={styles.input}
                contentStyle={styles.inputContent}
                outlineStyle={styles.inputBorder}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                mode="outlined"
                placeholder={state.strings.server}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                right={<TextInput.Icon style={styles.icon} icon="filter" onPress={() => setSearch(true)} />}
                value={state.server}
                onChangeText={value => actions.setServer(value)}
              />
            )}
            {search && (
              <TextInput
                dense={true}
                style={styles.input}
                contentStyle={styles.inputContent}
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
            contentContainerStyle={styles.smallListContainer}
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
                <Card containerStyle={styles.smCard} imageUrl={item.imageUrl} name={item.name} handle={item.handle} node={item.node} placeholder={state.strings.name} select={select} actions={[]} />
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
    </View>
  );
}
