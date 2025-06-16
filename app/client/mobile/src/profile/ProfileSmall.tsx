import React, {useState} from 'react';
import {Icon, Text, TextInput, Surface, Divider, useTheme} from 'react-native-paper';
import {ScrollView, Pressable, Image, View} from 'react-native';
import {styles} from './Profile.styled';
import {useProfile} from './useProfile.hook';
import {Confirm} from '../confirm/Confirm';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ContactParams} from './Profile';

export function ProfileSmall({close, params}: {close: () => void; params: ContactParams}) {
  const {state, actions} = useProfile(params);
  const theme = useTheme();
  const [confirmShow, setConfirmShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmParams, setConfirmParams] = useState({});
  const [removing, setRemoving] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [ignoring, setIgnoring] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const confirmAction = (title: string, prompt: string, label: string, loading: (boolean) => void, action: () => Promise<void>) => {
    setConfirmParams({
      title,
      prompt,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
      confirm: {
        label,
        action: async () => {
          if (!busy) {
            loading(true);
            setBusy(true);
            await setAction(action);
            setBusy(false);
            loading(false);
          }
        },
      },
    });
    setConfirmShow(true);
  };

  const applyAction = async (loading: (boolean) => void, action: () => Promise<void>) => {
    if (!busy) {
      setBusy(true);
      loading(true);
      await setAction(action);
      loading(false);
      setBusy(false);
    }
  };

  const setAction = async (action: () => Promise<void>) => {
    try {
      await action();
      setConfirmShow(false);
    } catch (err) {
      console.log(err);
      setConfirmParams({
        title: state.strings.operationFailed,
        prompt: state.strings.tryAgain,
        cancel: {
          label: state.strings.cancel,
          action: () => setConfirmShow(false),
        },
      });
      setConfirmShow(true);
    }
  };

  return (
    <View style={styles.component}>
      <Surface mode="flat" elevation={2} style={styles.profile}>
        <Surface mode="flat" elevation={9}>
          <SafeAreaView style={styles.navHeader} edges={['left', 'right']}>
            <Pressable style={styles.navIcon} onPress={close}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <View style={styles.title}>
              <Text style={styles.smLabel}>{state.strings.profile}</Text>
            </View>
            <View style={styles.navIcon} />
          </SafeAreaView>
        </Surface>
        <View style={styles.navImage}>
          <Image style={styles.navLogo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
          <Surface style={styles.overlap} elevation={2} mode="flat" />
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.imageSpacer} />
            <Surface elevation={2} mode="flat" style={styles.surfaceMaxWidth}>
              <SafeAreaView style={styles.form} edges={['left', 'right']}>
                <View style={styles.nameTag}>
                  {state.name && (
                    <Text variant="headlineMedium" style={styles.name} numberOfLines={1} minimumFontScale={0.75} adjustsFontSizeToFit={true}>
                      {state.name}
                    </Text>
                  )}
                  {!state.name && (
                    <Text variant="headlineMedium" style={{...styles.namePlaceholder, color: theme.colors.tertiary}}>
                      {state.strings.name}
                    </Text>
                  )}
                  {state.status === 'requested' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.requested}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.requestedTag}
                      </Text>
                    </View>
                  )}
                  {state.offsync && state.status === 'connected' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.offsync}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.offsyncTag}
                      </Text>
                    </View>
                  )}
                  {!state.offsync && state.status === 'connected' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.connected}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.connectedTag}
                      </Text>
                    </View>
                  )}
                  {state.status === 'connecting' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.connecting}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.connectingTag}
                      </Text>
                    </View>
                  )}
                  {state.status === 'pending' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.pending}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.pendingTag}
                      </Text>
                    </View>
                  )}
                  {state.status === 'confirmed' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.confirmed}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.confirmedTag}
                      </Text>
                    </View>
                  )}
                  {state.status === '' && (
                    <View style={{...styles.tag, backgroundColor: theme.colors.unsaved}}>
                      <Text variant="labelMedium" style={styles.tagLabel}>
                        {state.strings.unsavedTag}
                      </Text>
                    </View>
                  )}
                </View>
                <Surface elevation={0} mode="flat" style={styles.data}>
                  <TextInput
                    style={styles.navInput}
                    mode="outlined"
                    outlineStyle={styles.navInputBorder}
                    textColor={theme.colors.tertiary}
                    disabled={true}
                    value={`${state.handle}${state.node ? '@' + state.node : ''}`}
                    left={<TextInput.Icon style={styles.icon} iconColor={theme.colors.tertiary} size={22} icon="user" />}
                  />
                  <Divider style={styles.navDivider} />
                  <View style={styles.field}>
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      placeholder={state.strings.location}
                      placeholderTextColor={theme.colors.secondary}
                      value={state.location}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="map-pin" />}
                    />
                    <View style={styles.cover} />
                  </View>
                  <Divider style={styles.navDivider} />
                  <View style={styles.field}>
                    <TextInput
                      style={styles.navInput}
                      contentStyle={styles.navDescription}
                      mode="outlined"
                      multiline={true}
                      outlineStyle={styles.navInputBorder}
                      placeholder={state.strings.description}
                      placeholderTextColor={theme.colors.secondary}
                      value={state.description}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="align-left" />}
                    />
                    <View style={styles.cover} />
                  </View>

                  {state.statusLabel === 'unknownStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.connectAction}
                        left={<TextInput.Icon style={styles.icon} loading={connecting} size={24} icon="link" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setConnecting, actions.saveAndConnect)} />
                    </View>
                  )}

                  {state.statusLabel === 'savedStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.connectAction}
                        left={<TextInput.Icon style={styles.icon} loading={connecting} size={24} icon="link" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setConnecting, actions.connect)} />
                    </View>
                  )}

                  {(state.statusLabel === 'pendingStatus' || state.statusLabel === 'unknownStatus') && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.saveAction}
                        left={<TextInput.Icon style={styles.icon} loading={saving} size={24} icon="content-save-outline" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setSaving, actions.save)} />
                    </View>
                  )}

                  {(state.statusLabel === 'requestedStatus' || state.statusLabel === 'pendingStatus') && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.acceptAction}
                        left={<TextInput.Icon style={styles.icon} loading={accepting} size={24} icon="account-check-outline" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setAccepting, actions.accept)} />
                    </View>
                  )}

                  {state.statusLabel === 'offsyncStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.resyncAction}
                        left={<TextInput.Icon style={styles.icon} loading={resyncing} size={24} icon="cached" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setResyncing, actions.resync)} />
                    </View>
                  )}

                  {(state.statusLabel === 'connectedStatus' || state.statusLabel === 'offsyncStatus') && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.disconnectAction}
                        left={<TextInput.Icon style={styles.icon} loading={disconnecting} size={24} icon="link-break" />}
                      />
                      <Pressable
                        style={styles.cover}
                        onPress={() => confirmAction(state.strings.disconnecting, state.strings.confirmDisconnect, state.strings.disconnect, setDisconnecting, actions.disconnect)}
                      />
                    </View>
                  )}

                  {state.statusLabel === 'connectingStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.cancelAction}
                        left={<TextInput.Icon style={styles.icon} loading={canceling} size={24} icon="cancel" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setCanceling, actions.cancel)} />
                    </View>
                  )}

                  {(state.statusLabel === 'requestedStatus' || state.statusLabel === 'pendingStatus') && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.ignoreAction}
                        left={<TextInput.Icon style={styles.icon} loading={ignoring} size={24} icon="volume-mute" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setIgnoring, actions.ignore)} />
                    </View>
                  )}

                  {(state.statusLabel === 'requestedStatus' || state.statusLabel === 'pendingStatus') && state.guid !== state.profile.guid && (
                    <View style={styles.field}>
                      <Divider style={styles.navDivider} />
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        value={state.strings.denyAction}
                        left={<TextInput.Icon style={styles.icon} loading={denying} size={24} icon="account-cancel-outline" />}
                      />
                      <Pressable style={styles.cover} onPress={() => applyAction(setDenying, actions.deny)} />
                    </View>
                  )}

                  {(state.statusLabel === 'connectedStatus' ||
                    state.statusLabel === 'offsyncStatus' ||
                    state.statusLabel === 'connectingStatus' ||
                    state.statusLabel === 'requestedStatus' ||
                    state.statusLabel === 'pendingStatus' ||
                    state.statusLabel === 'savedStatus') &&
                    state.guid !== state.profile.guid && (
                      <View style={styles.field}>
                        <Divider style={styles.navDivider} />
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          value={state.strings.deleteAction}
                          left={<TextInput.Icon style={styles.icon} loading={removing} size={24} icon="trash-2" />}
                        />
                        <Pressable style={styles.cover} onPress={() => confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove)} />
                      </View>
                    )}

                  {(state.statusLabel === 'connectedStatus' ||
                    state.statusLabel === 'offsyncStatus' ||
                    state.statusLabel === 'connectingStatus' ||
                    state.statusLabel === 'requestedStatus' ||
                    state.statusLabel === 'pendingStatus' ||
                    state.statusLabel === 'savedStatus') &&
                    state.guid !== state.profile.guid && (
                      <View style={styles.field}>
                        <Divider style={styles.navDivider} />
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          value={state.strings.blockAction}
                          left={<TextInput.Icon style={styles.icon} loading={blocking} size={24} icon="close-circle-outline" />}
                        />
                        <Pressable style={styles.cover} onPress={() => confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block)} />
                      </View>
                    )}

                  {(state.statusLabel === 'connectedStatus' ||
                    state.statusLabel === 'offsyncStatus' ||
                    state.statusLabel === 'connectingStatus' ||
                    state.statusLabel === 'requestedStatus' ||
                    state.statusLabel === 'pendingStatus' ||
                    state.statusLabel === 'savedStatus' ||
                    state.statusLabel === 'unknownStatus') &&
                    state.guid !== state.profile.guid && (
                      <View style={styles.field}>
                        <Divider style={styles.navDivider} />
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          value={state.strings.reportAction}
                          left={<TextInput.Icon style={styles.icon} loading={reporting} size={24} icon="alert-decagram-outline" />}
                        />
                        <Pressable style={styles.cover} onPress={() => confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report)} />
                      </View>
                    )}
                </Surface>
              </SafeAreaView>
            </Surface>
          </ScrollView>
        </View>
      </Surface>
      <Confirm show={confirmShow} params={confirmParams} />
    </View>
  );
}
