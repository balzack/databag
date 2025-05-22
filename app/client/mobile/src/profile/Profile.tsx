import React, {useState} from 'react';
import {Icon, Text, TextInput, Surface, IconButton, Divider, useTheme} from 'react-native-paper';
import {ScrollView, Pressable, Image, View} from 'react-native';
import {styles} from './Profile.styled';
import {useProfile} from './useProfile.hook';
import {Confirm} from '../confirm/Confirm';

export type ContactParams = {
  guid: string;
  handle?: string;
  node?: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  cardId?: string;
  status?: string;
  offsync?: boolean;
};

export function Profile({close, params}: {close: () => void; params: ContactParams}) {
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
      { state.layout === 'small' && (
        <View style={styles.profile}>
          <Surface elevation={9} style={styles.navHeader}>
            <Pressable style={styles.navIcon} onPress={close}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <Text variant="headlineSmall" style={styles.navTitle}>{ state.strings.profile }</Text>
            <View style={styles.navIcon} />
          </Surface>
          <View style={styles.navImage}>
            <Image style={styles.navLogo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
            <Surface style={styles.overlap} elevation={2} mode="flat" />
          </View>
          <View style={styles.scrollWrapper}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              <View style={styles.imageSpacer} />
              <Surface elevation={2} mode="flat" style={styles.form}>
                <View style={styles.nameTag}>
                  {state.name && (
                    <Text variant="headlineMedium" style={styles.name} numberOfLines={1} minimumFontScale={0.75} adjustsFontSizeToFit={true}>{ state.name }</Text>
                  )}
                  {!state.name && <Text variant="headlineMedium" style={{ ...styles.namePlaceholder, color: theme.colors.tertiary }}>{state.strings.name}</Text>}
                  { state.status === 'requested' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.requested }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.requestedTag }</Text></View>
                  )}
                  { state.status === 'connected' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.connected }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.connectedTag }</Text></View>
                  )}
                  { state.status === 'connecting' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.connecting }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.connectingTag }</Text></View>
                  )}
                  { state.status === 'pending' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.pending }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.pendingTag }</Text></View>
                  )}
                  { state.status === 'saved' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.saved }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.savedTag }</Text></View>
                  )}
                  { state.status === '' && (
                    <View style={{ ...styles.tag, backgroundColor: theme.colors.unsaved }}><Text variant="labelMedium" style={styles.tagLabel}>{ state.strings.unsavedTag }</Text></View>
                  )}
                </View>
                <Surface elevation={0} mode="flat" style={styles.data}>
                  <TextInput
                    style={styles.navInput}
                    mode="outlined"
                    outlineStyle={styles.navInputBorder}
                    textColor={theme.colors.tertiary}
                    disabled={true}
                    value={`${state.handle}${state.node ? '/' + state.node : ''}`}
                    left={<TextInput.Icon style={styles.icon} iconColor={theme.colors.tertiary} size={22} icon="user" />}
                  />
                  <Divider style={styles.navDivider} />
                  <View style={styles.field}>
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      placeholder={state.strings.location}
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
                      value={state.description}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="align-left" />}
                    />
                    <View style={styles.cover} />
                  </View>
                  {state.statusLabel === 'unknownStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={connecting}
                          compact="true"
                          mode="contained"
                          icon="electric-switch-closed"
                          size={32}
                          onPress={() => {
                            applyAction(setConnecting, actions.saveAndConnect);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.connect}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={saving}
                          compact="true"
                          mode="contained"
                          icon="content-save-outline"
                          size={32}
                          onPress={() => {
                            applyAction(setSaving, actions.save);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.save}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}

                  {state.statusLabel === 'savedStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={saving}
                          compact="true"
                          mode="contained"
                          icon="electric-switch-closed"
                          size={32}
                          onPress={() => {
                            applyAction(setSaving, actions.connect);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.connect}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={removing}
                          compact="true"
                          mode="contained"
                          icon="account-remove"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={blocking}
                          compact="true"
                          mode="contained"
                          icon="eye-remove-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.block}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}

                  {state.statusLabel === 'pendingStatus' && state.guid !== state.profile.guid && (
                    <View>
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
                      <View style={styles.field}>
                        <Divider style={styles.navDivider} />
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          value={state.strings.reportAction}
                          left={<TextInput.Icon style={styles.icon} loading={blocking} size={24} icon="alert-decagram-outline" />}
                        />
                        <Pressable style={styles.cover} onPress={() => confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report)} />
                      </View>
 
                    </View>
                  )}

                  {state.statusLabel === 'requestedStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={saving}
                          compact="true"
                          mode="contained"
                          icon="account-check-outline"
                          size={32}
                          onPress={() => {
                            applyAction(setAccepting, actions.accept);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.accept}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={ignoring}
                          compact="true"
                          mode="contained"
                          icon="volume-mute"
                          size={32}
                          onPress={() => {
                            applyAction(setIgnoring, actions.ignore);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.ignore}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={denying}
                          compact="true"
                          mode="contained"
                          icon="close-circle-outline"
                          size={32}
                          onPress={() => {
                            applyAction(setDenying, actions.deny);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.deny}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={removing}
                          compact="true"
                          mode="contained"
                          icon="account-remove"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={blocking}
                          compact="true"
                          mode="contained"
                          icon="eye-remove-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.block}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}

                  {state.statusLabel === 'connectingStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={canceling}
                          compact="true"
                          mode="contained"
                          icon="cancel"
                          size={32}
                          onPress={() => {
                            applyAction(setCanceling, actions.cancel);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.cancel}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={removing}
                          compact="true"
                          mode="contained"
                          icon="account-remove"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={blocking}
                          compact="true"
                          mode="contained"
                          icon="eye-remove-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.block}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}

                  {state.statusLabel === 'connectedStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={disconnecting}
                          compact="true"
                          mode="contained"
                          icon="electric-switch"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.disconnecting, state.strings.confirmDisconnect, state.strings.disconnect, setDisconnecting, actions.disconnect);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.disconnect}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={removing}
                          compact="true"
                          mode="contained"
                          icon="account-remove"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={blocking}
                          compact="true"
                          mode="contained"
                          icon="eye-remove-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.block}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}

                  {state.statusLabel === 'offsyncStatus' && state.guid !== state.profile.guid && (
                    <View style={styles.actions}>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={resyncing}
                          compact="true"
                          mode="contained"
                          icon="cached"
                          size={32}
                          onPress={() => {
                            applyAction(setResyncing, actions.resync);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.resync}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={disconnecting}
                          compact="true"
                          mode="contained"
                          icon="electric-switch"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.disconnecting, state.strings.confirmDisconnect, state.strings.disconnect, setDisconnecting, actions.disconnect);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.disconnect}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={removing}
                          compact="true"
                          mode="contained"
                          icon="account-remove"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={blocking}
                          compact="true"
                          mode="contained"
                          icon="eye-remove-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.block}</Text>
                      </View>
                      <View style={styles.action}>
                        <IconButton
                          style={styles.actionIcon}
                          loading={reporting}
                          compact="true"
                          mode="contained"
                          icon="alert-octagon-outline"
                          size={32}
                          onPress={() => {
                            confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                          }}
                        />
                        <Text style={styles.actionLabel}>{state.strings.report}</Text>
                      </View>
                    </View>
                  )}
                </Surface>
              </Surface>
            </ScrollView>
          </View>
        </View>
      )}
      { state.layout === 'large' && (
        <View style={styles.profile}>
          <View style={styles.header}>
            {close && (
              <View style={styles.spaceHolder}>
                <IconButton style={styles.back} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />
              </View>
            )}
            {state.node && <Text style={styles.headerLabel} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.handle}@${state.node}`}</Text>}
            {!state.node && (
              <Text style={styles.headerLabel} adjustsFontSizeToFit={true} numberOfLines={1}>
                {state.handle}
              </Text>
            )}
            {close && <View style={styles.spaceHolder} />}
          </View>
          <Divider style={styles.border} bold={true} />

          <View style={styles.scrollWrapper}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              <View style={styles.image}>
                <Image style={styles.logo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
              </View>

              <View style={styles.body}>
                <Divider style={styles.line} bold={true} />
                <View style={styles.attributes}>
                  {!state.name && <Text style={styles.nameUnset}>{state.strings.name}</Text>}
                  {state.name && (
                    <Text style={styles.nameSet} adjustsFontSizeToFit={true} numberOfLines={1}>
                      {state.name}
                    </Text>
                  )}
                  <View style={styles.attribute}>
                    <View style={styles.icon}>
                      <Icon size={24} source="map-marker-outline" />
                    </View>
                    {!state.location && <Text style={styles.labelUnset}>{state.strings.location}</Text>}
                    {state.location && <Text style={styles.labelSet}>{state.location}</Text>}
                  </View>
                  <View style={styles.attribute}>
                    <View style={styles.icon}>
                      <Icon size={24} source="book-open-outline" />
                    </View>
                    {!state.description && <Text style={styles.labelUnset}>{state.strings.description}</Text>}
                    {state.description && <Text style={styles.labelSet}>{state.description}</Text>}
                  </View>
                </View>
                <Divider style={styles.line} bold={true} />
                {state.guid !== state.profile.guid && (
                  <View style={styles.status}>
                    <Text style={styles[state.statusLabel]}>{state.strings[state.statusLabel]}</Text>
                  </View>
                )}

                {state.statusLabel === 'unknownStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={connecting}
                        compact="true"
                        mode="contained"
                        icon="electric-switch-closed"
                        size={32}
                        onPress={() => {
                          applyAction(setConnecting, actions.saveAndConnect);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.connect}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={saving}
                        compact="true"
                        mode="contained"
                        icon="content-save-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setSaving, actions.save);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.save}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'savedStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={saving}
                        compact="true"
                        mode="contained"
                        icon="electric-switch-closed"
                        size={32}
                        onPress={() => {
                          applyAction(setSaving, actions.connect);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.connect}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'pendingStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={saving}
                        compact="true"
                        mode="contained"
                        icon="content-save-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setSaving, actions.save);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.save}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={accepting}
                        compact="true"
                        mode="contained"
                        icon="account-check-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setAccepting, actions.accept);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.accept}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={ignoring}
                        compact="true"
                        mode="contained"
                        icon="volume-mute"
                        size={32}
                        onPress={() => {
                          applyAction(setIgnoring, actions.ignore);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.ignore}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={denying}
                        compact="true"
                        mode="contained"
                        icon="close-circle-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setDenying, actions.deny);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.deny}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'requestedStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={saving}
                        compact="true"
                        mode="contained"
                        icon="account-check-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setAccepting, actions.accept);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.accept}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={ignoring}
                        compact="true"
                        mode="contained"
                        icon="volume-mute"
                        size={32}
                        onPress={() => {
                          applyAction(setIgnoring, actions.ignore);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.ignore}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={denying}
                        compact="true"
                        mode="contained"
                        icon="close-circle-outline"
                        size={32}
                        onPress={() => {
                          applyAction(setDenying, actions.deny);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.deny}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'connectingStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={canceling}
                        compact="true"
                        mode="contained"
                        icon="cancel"
                        size={32}
                        onPress={() => {
                          applyAction(setCanceling, actions.cancel);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.cancel}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'connectedStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={disconnecting}
                        compact="true"
                        mode="contained"
                        icon="electric-switch"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.disconnecting, state.strings.confirmDisconnect, state.strings.disconnect, setDisconnecting, actions.disconnect);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.disconnect}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}

                {state.statusLabel === 'offsyncStatus' && state.guid !== state.profile.guid && (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={resyncing}
                        compact="true"
                        mode="contained"
                        icon="cached"
                        size={32}
                        onPress={() => {
                          applyAction(setResyncing, actions.resync);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.resync}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={disconnecting}
                        compact="true"
                        mode="contained"
                        icon="electric-switch"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.disconnecting, state.strings.confirmDisconnect, state.strings.disconnect, setDisconnecting, actions.disconnect);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.disconnect}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={removing}
                        compact="true"
                        mode="contained"
                        icon="account-remove"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.removing, state.strings.confirmRemove, state.strings.remove, setRemoving, actions.remove);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.remove}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={blocking}
                        compact="true"
                        mode="contained"
                        icon="eye-remove-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.blocking, state.strings.confirmBlocking, state.strings.block, setBlocking, actions.block);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.block}</Text>
                    </View>
                    <View style={styles.action}>
                      <IconButton
                        style={styles.actionIcon}
                        loading={reporting}
                        compact="true"
                        mode="contained"
                        icon="alert-octagon-outline"
                        size={32}
                        onPress={() => {
                          confirmAction(state.strings.reporting, state.strings.confirmReporting, state.strings.report, setReporting, actions.report);
                        }}
                      />
                      <Text style={styles.actionLabel}>{state.strings.report}</Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
      <Confirm show={confirmShow} busy={busy} params={confirmParams} />
    </View>
  );
}
