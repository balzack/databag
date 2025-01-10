import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {useTheme, Surface, Icon, Divider, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Details.styled';
import {useDetails} from './useDetails.hook';
import { Confirm } from '../confirm/Confirm';
import { Card } from '../card/Card';

export function Details({close, closeAll}: {close: ()=>void, closeAll: ()=>void}) {
  const { state, actions } = useDetails();
  const [alert, setAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const theme = useTheme();

  const members = () => {
  }

  const remove = () => {
  }

  const leave = () => {
  }

  const block = () => {
  }

  const reprot = () => {
  }

  const alertParams = {
    title: state.strings.operationFailer,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  const saveSubject = async () => {
    if (!saving) {
      setSaving(true);
      try {
        await actions.saveSubject();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSaving(false);
    }    
  }

  const cards = state.channelCards.map((card, index) => (
      <Card containerStyle={styles.card} key={index} imageUrl={card.imageUrl} name={card.name} placeholder={state.strings.name}
        handle={card.handle} node={card.node} actions={[]} />
  ))

  return (
    <View style={styles.details}>
      <SafeAreaView style={styles.header}>
        {close && (
          <View style={styles.close}>
            <IconButton style={styles.closeIcon} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />
          </View>
        )}
        <Text style={styles.title}>{ state.strings.details }</Text>
        {close && (
          <View style={styles.close} />
        )} 
      </SafeAreaView>
      <Divider style={styles.divider} />
      { !state.access && (
        <Text style={styles.noAccess}>{ state.strings.noAccess }</Text>
      )}
      { state.access && (
        <View style={styles.info}>
          { state.locked && (
            <Text style={styles.encrypted}>{ state.strings.encrypted }</Text>
          )}
          { state.host && !state.locked && (
            <Surface style={styles.subject} mode="flag" elevation={4}>
              <TextInput
                style={styles.input}
                underlineStyle={styles.underline}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.editSubject}
                label={state.strings.subject}
                disabled={state.locked}
                left={<TextInput.Icon style={styles.icon} icon="label-outline" />}
                onChangeText={value => actions.setEditSubject(value)}
              />
              { state.subject !== state.editSubject && (
                <IconButton style={styles.icon} icon="undo-variant" onPress={actions.undoSubject} />
              )}
              { state.subject !== state.editSubject && (
                <IconButton style={styles.icon} icon="content-save-outline" loading={saving} onPress={saveSubject} /> 
              )} 
            </Surface>
          )}
          { !state.host && !state.locked && (
            <View style={styles.item}>
              <IconButton style={styles.icon} size={28} icon="label-outline" />
              <Text style={styles.itemHeader}>{ state.subject }</Text>
            </View>
          )}
          <View style={styles.item}>
            <Icon source="calendar-month-outline" size={22} />
            <Text style={styles.itemLabel}>{ state.created }</Text>
          </View>
          { state.host && (
            <View style={styles.item}>
              <Icon source="home-outline" size={22} />
              <Text style={styles.itemLabel}>{ state.strings.channelHost }</Text>
            </View>
          )}
          { !state.host && (
            <View style={styles.item}>
              <Icon source="server" size={22} />
              <Text style={styles.itemLabel}>{ state.strings.channelGuest }</Text>
            </View>
          )}
          { state.sealed && (
            <View style={styles.item}>
              <Icon source="shield-outline" size={22} />
              <Text style={styles.itemLabel}>{ state.strings.sealed }</Text>
            </View>
          )}
          { !state.sealed && (
            <View style={styles.item}>
              <Icon source="shield-off-outline" size={22} />
              <Text style={styles.itemLabel}>{ state.strings.notSealed }</Text>
            </View>
          )}
        </View>
      )}
      <Divider style={styles.divider} />
      { !state.host && state.access && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <IconButton
              style={styles.actionIcon}
              loading={removing}
              compact="true"
              mode="contained"
              icon="logout-variant"
              size={32}
              onPress={leave}
            />
            <Text style={styles.actionLabel}>{state.strings.leave}</Text>
          </View>
          <View style={styles.action}>
            <IconButton
              style={styles.actionIcon}
              loading={blocking}
              compact="true"
              mode="contained"
              icon="eye-off-outline"
              size={32}
              onPress={block}
            />
            <Text style={styles.actionLabel}>{state.strings.block}</Text>
          </View>
          <View style={styles.action}>
            <IconButton
              style={styles.actionIcon}
              loading={reporting}
              compact="true"
              mode="contained"
              icon="alert-octogon-outline"
              size={32}
              onPress={report}
            />
            <Text style={styles.actionLabel}>{state.strings.report}</Text>
          </View>
        </View>
      )}
      { state.host && state.access && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <IconButton
              style={styles.actionIcon}
              loading={removing}
              compact="true"
              mode="contained"
              icon="message-minus-outline"
              size={32}
              onPress={remove}
            />
            <Text style={styles.actionLabel}>{state.strings.remove}</Text>
          </View>
          <View style={styles.action}>
            <IconButton
              style={styles.actionIcon}
              compact="true"
              mode="contained"
              icon="account-cog-outline"
              size={32}
              onPress={members}
            />
            <Text style={styles.actionLabel}>{state.strings.members}</Text>
          </View>
        </View>
      )}
      <Text style={styles.membership}>{ state.strings.membership }</Text>
      <Divider style={styles.divider} />
      <ScrollView style={styles.members}>
        { state.hostCard && (
          <Card containerStyle={{...styles.card, borderColor: theme.colors.outlineVariant }} imageUrl={state.hostCard.imageUrl} name={state.hostCard.name} placeholder={state.strings.name}
            handle={state.hostCard.handle} node={state.hostCard.node} actions={[<Icon key="host" source="home-outline" size={20} />]} />
        )}
        { state.profile && (
          <Card containerStyle={{ ...styles.card, borderColor: theme.colors.outlineVariant }} imageUrl={state.profile.imageUrl} name={state.profile.name} placeholder={state.strings.name}
            handle={state.profile.handle} node={state.profile.node} actions={state.host ? [<Icon key="host" source="home-outline" size={20} />] : []} />
        )}
        { cards }
        { state.unknownContacts > 0 && (
          <Text style={styles.unknown}>{ state.strings.unknown }: {state.unknownContacts}</Text>
        )}
      </ScrollView>
      <Confirm show={alert} params={alertParams} />
    </View>
  )
}

// input if host and unsealed
// text otherwise
