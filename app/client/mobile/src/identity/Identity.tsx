import React, {useState} from 'react';
import {Modal, TouchableOpacity, SafeAreaView, View, Image} from 'react-native';
import {Surface, IconButton, Button, Switch, Icon, Text, Menu} from 'react-native-paper';
import {styles} from './Identity.styled';
import {useIdentity} from './useIdentity.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BlurView} from '@react-native-community/blur';

export function Identity({openSettings, openContacts}) {
  const [menu, setMenu] = useState(false);
  const {state, actions} = useIdentity();
  const [logout, setLogout] = useState(false);
  const [applyingLogout, setApplyingLogout] = useState(false);

  const showLogout = () => {
    setMenu(false);
    setLogout(true);
  };

  const applyLogout = async () => {
    if (!applyingLogout) {
      setApplyingLogout(true);
      await actions.logout();
      setLogout(false);
      setApplyingLogout(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.identity}>
        <TouchableOpacity style={styles.identityData} activeOpacity={1} onPress={() => setMenu(true)}>
          <View style={styles.image}>
            {state.profile.imageSet && <Image style={styles.logoSet} resizeMode={'contain'} source={state.imageUrl} />}
            {!state.profile.imageSet && <Image style={styles.logoUnset} resizeMode={'contain'} source={state.imageUrl} />}
          </View>
          <View style={styles.details}>
            {state.profile.name && (
              <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>
                {state.profile.name}
              </Text>
            )}
            <Text style={styles.username} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          </View>
          <Icon size={18} source="chevron-right" />
        </TouchableOpacity>
        <Menu
          visible={menu}
          onDismiss={() => setMenu(false)}
          anchorPosition="top"
          anchor={
            <View style={styles.anchor}>
              <Text> </Text>
            </View>
          }>
          <Menu.Item
            leadingIcon="cog-outline"
            onPress={() => {
              setMenu(false);
              openSettings();
            }}
            title={state.strings.settings}
          />
          <Menu.Item
            leadingIcon="contacts-outline"
            onPress={() => {
              setMenu(false);
              openContacts();
            }}
            title={state.strings.contacts}
          />
          <Menu.Item leadingIcon="logout" onPress={showLogout} title={state.strings.logout} />
        </Menu>
      </SafeAreaView>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={logout} onRequestClose={() => setLogout(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.loggingOut}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setLogout(false)} />

              <View style={styles.allControl}>
                <Text style={styles.controlLabel}>{state.strings.allDevices}</Text>
                <Switch style={styles.controlSwitch} value={state.all} onValueChange={actions.setAll} />
              </View>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setLogout(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={applyingLogout} onPress={applyLogout}>
                  {state.strings.logout}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </>
  );
}
