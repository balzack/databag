import React, {useState} from 'react';
import { Button, Surface, Icon, Text, IconButton, Divider } from 'react-native-paper';
import { ScrollView, Modal, Image, SafeAreaView, View } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import {BlurView} from '@react-native-community/blur';
import { Confirm } from '../confirm/Confirm';

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
}

export function Profile({ close, params }) {
  const [ alert, setAlert ] = useState(false);
  const { state, actions } = useProfile(params);
  const [ confirmShow, setConfirmShow ] = useState(false);
  const [ busy, setBusy ] = useState(false);
  const [ confirmParams, setConfirmParams ] = useState({});
  const [removing, setRemoving] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [ignoring, setIgnoring] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [confirming, setConfirming] = useState(false);


  const confirmAction = (title: string, prompt: string, label: string, loading: (boolean)=>void, action: ()=>Promise<void>) => {
    setConfirmParams({ title, prompt, cancel: { label: state.strings.cancel, action: ()=>setConfirmShow(false) }, confirm: { label, action: async () => {
      if (!busy) {
        loading(true);
        setBusy(true);
        await setAction(action);
        setBusy(false);
        loading(false);
      }
    }}});
    setConfirmShow(true);
  }

  const applyAction = async (loading: (boolean)=>void, action: ()=>Promise<void>) => {
    if (!busy) {
      setBusy(true);
      loading(true);
      await setAction(action);
      loading(false);
      setBusy(false);
    }
  }
  
  const setAction = async (action: ()=>Promise<void>) => {
    try {
      await action();
      setConfirmShow(false);
    }
    catch (err) {
      console.log(err);
      setConfirmParams({ title: state.strings.error, prompt: state.strings.tryAgain, cancel: { label: state.strings.cancel, action: ()=>setConfirmShow(false) }});
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profile}>
      <SafeAreaView style={styles.header}>
        { close && (
          <View style={styles.spaceHolder}>
            <IconButton style={styles.back} compact="true"  mode="contained" icon="arrow-left" size={24} onPress={close} />
          </View>
        )}
        <Text
          style={styles.headerLabel}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>{`${state.handle}${
          state.node ? '/' + state.node : ''
        }`}</Text>
        { close && (
          <View style={styles.spaceHolder}></View>
        )}
      </SafeAreaView>

      <View style={styles.image}>
        <Image
          style={styles.logo}
          resizeMode={'contain'}
          source={{uri: state.imageUrl}}
        />
      </View>

      <View style={styles.body}>
        <Divider style={styles.line} bold={true} />
        <View style={styles.attributes}>
          {!state.name && (
            <Text style={styles.nameUnset}>{state.strings.name}</Text>
          )}
          {state.name && (
            <Text
              style={styles.nameSet}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              {state.name}
            </Text>
          )}
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="map-marker-outline" />
            </View>
            {!state.location && (
              <Text style={styles.labelUnset}>{state.strings.location}</Text>
            )}
            {state.location && (
              <Text style={styles.labelSet}>{state.location}</Text>
            )}
          </View>
          <View style={styles.attribute}>
            <View style={styles.icon}>
              <Icon size={24} source="book-open-outline" />
            </View>
            {!state.description && (
              <Text style={styles.labelUnset}>
                {state.strings.description}
              </Text>
            )}
            {state.description && (
              <Text style={styles.labelSet}>{state.description}</Text>
            )}
          </View>
        </View>
        <Divider style={styles.line} bold={true} />
        <View style={styles.status}>
          <Text style={styles[state.statusLabel]}>{ state.strings[state.statusLabel] }</Text>
        </View>

        { state.statusLabel === 'unknownStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={saving} compact="true"  mode="contained" icon="content-save-outline" size={32} onPress={() => {
                applyAction(setSaving, actions.save);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.save }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'savedStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={saving} compact="true"  mode="contained" icon="electric-switch-closed" size={32} onPress={() => {
                applyAction(setSaving, actions.connect);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.connect }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'pendingStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={saving} compact="true"  mode="contained" icon="content-save-outline" size={32} onPress={() => {
                applyAction(setSaving, actions.save);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.save }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={accepting} compact="true"  mode="contained" icon="electric-switch-closed" size={32} onPress={() => {
                applyAction(setAccepting, actions.accept);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.accept }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={ignoring} compact="true"  mode="contained" icon="volume-mute" size={32} onPress={() => {
                applyAction(setIgnoring, actions.ignore);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.ignore }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={denying} compact="true"  mode="contained" icon="close-circle-outline" size={32} onPress={() => {
                applyAction(setDenying, actions.deny);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.deny }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'requestedStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={saving} compact="true"  mode="contained" icon="electric-switch-closed" size={32} onPress={() => {
                applyAction(setAccepting, actions.accept);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.accept }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={ignoring} compact="true"  mode="contained" icon="volume-mute" size={32} onPress={() => {
                applyAction(setIgnoring, actions.ignore);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.ignore }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={denying} compact="true"  mode="contained" icon="close-circle-outline" size={32} onPress={() => {
                applyAction(setDenying, actions.deny);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.deny }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'connectingStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={canceling} compact="true"  mode="contained" icon="cancel" size={32} onPress={() => {
                applyAction(setCanceling, actions.cancel);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.cancel }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'connectedStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={disconnecting} compact="true"  mode="contained" icon="electric-switch" size={32} onPress={() => {
                const { disconnecting, confirmDisconnecting, disconnect } = state.strings;
                confirmAction(disconnecting, confirmDisconnect, disconnect, setDisconnecting, actions.disconnect);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.disconnect }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

        { state.statusLabel === 'offsyncStatus' && (
          <View style={styles.actions}>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={resyncing} compact="true"  mode="contained" icon="cached" size={32} onPress={() => {
                applyAction(setResycning, actions.resync);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.resync }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={disconnecting} compact="true"  mode="contained" icon="electric-switch" size={32} onPress={() => {
                const { disconnecting, confirmDisconnecting, disconnect } = state.strings;
                confirmAction(disconnecting, confirmDisconnect, disconnect, setDisconnecting, actions.disconnect);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.disconnect }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={removing} compact="true"  mode="contained" icon="account-remove" size={32} onPress={() => {
                const { removing, confirmRemove, remove } = state.strings;
                confirmAction(removing, confirmRemove, remove, setRemoving, actions.remove);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.remove }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={blocking} compact="true"  mode="contained" icon="eye-remove-outline" size={32} onPress={() => {
                const { blocking, confirmBlocking, block } = state.strings;
                confirmAction(blocking, confirmBlocking, block, setBlocking, actions.block);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.block }</Text>
            </View>
            <View style={styles.action}>
              <IconButton style={styles.actionIcon} loading={reporting} compact="true"  mode="contained" icon="alert-octagon-outline" size={32} onPress={() => {
                const { reporting, confirmReporting, report } = state.strings;
                confirmAction(reporting, confirmReporting, report, setReporting, actions.report);
              }} />
              <Text style={styles.actionLabel}>{ state.strings.report }</Text>
            </View>
          </View>
        )}

      </View>
      <Confirm show={confirmShow} busy={busy} params={confirmParams} />
    </ScrollView>
  )
}
