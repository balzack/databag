import React, {useContext} from 'react';
import {Button, Text, Divider, Icon} from 'react-native-paper';
import {SafeAreaView, TouchableOpacity, View, Image, ScrollView} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';

export function Settings() {
  const { state, actions } = useSettings();

  const SelectImage = async () => {
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.settings}>
        <Text style={styles.header}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
        { state.profile.imageSet && (
          <View style={styles.image}>
            <Image style={styles.logo} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
            <View style={styles.editBar}>
              <Button style={styles.setLogo} mode="text" onPress={SelectImage}>{state.strings.edit}</Button>
            </View>
          </View>
        )}
        { !state.profile.imageSet && (
          <TouchableOpacity style={styles.image} onPress={SelectImage}>
            <Image style={styles.logo} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
            <View style={styles.editBar}>
              <Text style={styles.unsetLogo}>{state.strings.edit}</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.editDivider}>
          <Divider style={styles.divider} bold={true} />
          <Button style={styles.editDetails} mode="text">{state.strings.edit}</Button>
        </View>

        <View style={styles.attributes}>
          {!state.profile.name && (
            <Text style={styles.nameUnset}>{state.strings.name}</Text>
          )}
          {state.profile.name && (
            <Text style={styles.nameSet}>{state.profile.name}</Text>
          )}
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="map-marker-outline" />
            </View>
            {!state.profile.location && (
              <Text style={styles.labelUnset}>{state.strings.location}</Text>
            )}
            {state.profile.location && (
              <Text style={styles.labelSet}>{state.profile.location}</Text>
            )}
          </View>
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="book-open-outline" />
            </View>
            {!state.profile.description && (
              <Text style={styles.labelUnset}>{state.strings.description}</Text>
            )}
            {state.profile.description && (
              <Text style={styles.labelSet}>{state.profile.description}</Text>
            )}
          </View>
        </View>

        <View style={styles.editDivider}>
          <Divider style={styles.divider} bold={true} />
        </View>

        <Button mode="contained" onPress={actions.logout}>
          Logout
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
}
