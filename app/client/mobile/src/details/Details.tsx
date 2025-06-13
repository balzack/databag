import React, {useState} from 'react';
import {SafeAreaView, Pressable, Platform, Modal, ScrollView, View} from 'react-native';
import {useTheme, Switch, Surface, Icon, Divider, Button, IconButton, Text, TextInput} from 'react-native-paper';
import {styles} from './Details.styled';
import {useDetails} from './useDetails.hook';
import {Confirm} from '../confirm/Confirm';
import {Card} from '../card/Card';
import {BlurView} from '@react-native-community/blur';

export function Details({close, edit, closeAll}: {close: () => void; edit: () => void; closeAll: () => void}) {
  const {state, actions} = useDetails();
  const [alert, setAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmParams, setConfirmParams] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [error, setError] = useState(false);
  const theme = useTheme();
  const [editing, setEditing] = useState(false);

  const membership = () => {
    setError(false);
    setMemberModal(true);
  };

  const remove = () => {
    const apply = async () => {
      await actions.remove();
      closeAll();
    };
    confirmAction(state.strings.confirmTopic, state.strings.sureTopic, state.strings.remove, setRemoving, apply);
  };

  const leave = () => {
    const apply = async () => {
      await actions.leave();
      closeAll();
    };
    confirmAction(state.strings.confirmLeave, state.strings.sureLeave, state.strings.leave, setRemoving, apply);
  };

  const block = () => {
    const apply = async () => {
      await actions.block();
    };
    confirmAction(state.strings.blockTopic, state.strings.blockTopicPrompt, state.strings.block, setBlocking, apply);
  };

  const report = () => {
    confirmAction(state.strings.reportTopic, state.strings.reportTopicPrompt, state.strings.report, setReporting, actions.report);
  };

  const confirmAction = (title: string, prompt: string, label: string, loading: (boolean) => void, action: () => Promise<void>) => {
    setConfirmParams({
      title,
      prompt,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirm(false),
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
    setConfirm(true);
  };

  const setAction = async (action: () => Promise<void>) => {
    try {
      await action();
      setConfirm(false);
    } catch (err) {
      console.log(err);
      setConfirmParams({
        title: state.strings.operationFailed,
        prompt: state.strings.tryAgain,
        cancel: {
          label: state.strings.cancel,
          action: () => setConfirm(false),
        },
      });
      setConfirm(true);
    }
  };

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
  };

  const smCards = state.channelCards.map((card, index) => (
    <Card
      containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
      key={index}
      imageUrl={card.imageUrl}
      name={card.name}
      placeholder={state.strings.name}
      handle={card.handle}
      node={card.node}
      actions={[]}
    />
  ));

  const cards = state.channelCards.map((card, index) => (
    <Card
      containerStyle={{...styles.card, borderColor: theme.colors.outlineVariant}}
      key={index}
      imageUrl={card.imageUrl}
      name={card.name}
      placeholder={state.strings.name}
      handle={card.handle}
      node={card.node}
      actions={[]}
    />
  ));

  const members = state.cards
    .filter(card => {
      if (state.detail && state.detail.members.find(member => member.guid === card.guid)) {
        return true;
      } else if (state.sealed && !card.sealable) {
        return false;
      } else {
        return true;
      }
    })
    .map((card, index) => {
      const enable = !state.detail
        ? []
        : [
            <Switch
              key="enable"
              style={styles.memberSwitch}
              value={Boolean(state.detail.members.find(member => member.guid === card.guid))}
              onValueChange={async flag => {
                try {
                  setError(false);
                  if (flag) {
                    await actions.setMember(card.cardId);
                  } else {
                    await actions.clearMember(card.cardId);
                  }
                } catch (err) {
                  console.log(err);
                  setError(true);
                }
              }}
            />,
          ];

      return (
        <Card
          containerStyle={{...styles.card, borderColor: theme.colors.outlineVariant}}
          key={index}
          imageUrl={card.imageUrl}
          name={card.name}
          placeholder={state.strings.name}
          handle={card.handle}
          node={card.node}
          actions={enable}
        />
      );
    });

  return (
    <View style={styles.component}>
      { state.layout === 'small' && (
        <Surface elevation={2} style={styles.smDetails} mode="flat">
          <Surface elevation={9} style={styles.smHeader} mode="flat">
            <Pressable style={styles.smIcon} onPress={close}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <Text style={styles.smTitle}>{ state.strings.chatSettings }</Text>
            <View style={styles.smIcon} />
          </Surface>
          <Surface mode="flat" elevation={2} style={styles.scrollWrapper}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              { state.locked && (
                <Text variant="labelLarge" style={{ ...styles.offsync, color: theme.colors.offsync }}>{ state.strings.offsync }</Text>
              )}
              { !state.locked && (
                <Text variant="labelLarge" style={styles.smDate}>{ state.created }</Text>
              )}
              <View style={styles.smSubject}>
                <TextInput
                  style={styles.smInput}
                  dense={true}
                  underlineStyle={styles.underline}
                  mode="flat"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  value={state.editSubject}
                  placeholder={state.strings.subject}
                  placeholderTextColor={theme.colors.secondary}
                  disabled={state.locked}
                  editable={state.host && !state.locked}
                  right={!editing && state.host && !state.locked ? <TextInput.Icon style={styles.icon} icon="edit" /> : undefined}
                  onChangeText={value => actions.setEditSubject(value)}
                  returnKeyType="done"
                  onSubmitEditing={saveSubject}
                  onFocus={() => setEditing(true)}
                  onBlur={() => setEditing(false)}
                />
                <View style={styles.smSpace} />
              </View>
              <Text variant="labelLarge" style={styles.smHost}>{ state.host ? state.strings.host : state.strings.guest }</Text>
              { state.sealed && (
                <View style={styles.sealed}>
                  <View style={{ ...styles.highlight, backgroundColor: theme.colors.connected }}>
                  <Icon source="shield-outline" color="white" size={16} />
                  <Text style={styles.e2ee}>{state.strings.e2ee}</Text>
                  </View>
                  <View style={styles.smSpace} />
                </View>
              )}
              <Text variant="headlineSmall" style={styles.smLabel}>{ state.strings.members }</Text>
              <View style={styles.section}>
                <Surface mode="flat" elevation={0} style={styles.content}>
                  {state.hostCard && (
                    <Card
                      containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                      imageUrl={state.hostCard.imageUrl}
                      name={state.hostCard.name}
                      placeholder={state.strings.name}
                      handle={state.hostCard.handle}
                      node={state.hostCard.node}
                      flair={<Icon key="host" source="award" size={18} color={theme.colors.requested} />}
                      actions={[]}
                    />
                  )}
                  {state.profile && (
                    <Card
                      containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                      imageUrl={state.profile.imageUrl}
                      name={state.profile.name}
                      placeholder={state.strings.name}
                      handle={state.profile.handle}
                      node={state.profile.node}
                      flair={state.host ? <Icon key="host" source="award" size={18} color={theme.colors.requested} /> : <></>}
                      actions={[]}
                    />
                  )}
                  {smCards}
                  {state.unknownContacts > 0 && (
                    <Text style={styles.unknown}>
                      {state.strings.unknown}: {state.unknownContacts}
                    </Text>
                  )}
                </Surface>
              </View>
              <View style={styles.section}>
                <Surface mode="flat" elevation={0} style={styles.content}>

                  { state.host && !state.locked && (
                    <View style={styles.option}>
                      <TextInput
                        style={styles.label}
                        mode="outlined"
                        outlineStyle={styles.border}
                        placeholder={state.strings.editMembers}
                        left={<TextInput.Icon style={styles.icon} size={24} icon="users" />}
                      />
                      <Pressable style={styles.press} onPress={edit} />
                    </View>
                  )}

                  { state.host && !state.locked && (
                    <Divider style={styles.split} />
                  )}

                  { state.host && (
                    <View style={styles.option}>
                      <TextInput
                        style={styles.label}
                        mode="outlined"
                        outlineStyle={styles.border}
                        placeholder={state.strings.deleteChat}
                        left={<TextInput.Icon style={styles.icon} loading={removing} size={24} icon="text-box-remove-outline" />}
                      />
                      <Pressable style={styles.press} onPress={remove} />
                    </View>
                  )}

                  { !state.host && (
                    <View style={styles.option}>
                      <TextInput
                        style={styles.label}
                        mode="outlined"
                        outlineStyle={styles.border}
                        placeholder={state.strings.leaveChat}
                        left={<TextInput.Icon style={styles.icon} loading={removing} size={24} icon="log-out" />}
                      />
                      <Pressable style={styles.press} onPress={leave} />
                    </View>
                  )}

                  { !state.host && (
                    <Divider style={styles.split} />
                  )}

                  { !state.host && (
                    <View style={styles.option}>
                      <TextInput
                        style={styles.label}
                        mode="outlined"
                        outlineStyle={styles.border}
                        placeholder={state.strings.blockChat}
                        left={<TextInput.Icon style={styles.icon} loading={blocking} size={24} icon="close-circle-outline" />}
                      />
                      <Pressable style={styles.press} onPress={block} />
                    </View>
                  )}

                  { !state.host && (
                    <Divider style={styles.split} />
                  )}

                  { !state.host && (
                    <View style={styles.option}>
                      <TextInput
                        style={styles.label}
                        mode="outlined"
                        outlineStyle={styles.border}
                        placeholder={state.strings.report}
                        left={<TextInput.Icon style={styles.icon} loading={reporting} size={24} icon="alert-decagram-outline" />}
                      />
                      <Pressable style={styles.press} onPress={report} />
                    </View>
                  )}
                </Surface>
              </View>
            </ScrollView>
          </Surface>
        </Surface>
      )}
      { state.layout === 'large' && (
        <View style={styles.details}>
          <SafeAreaView style={styles.header}>
            {close && (
              <View style={styles.close}>
                <IconButton style={styles.closeIcon} compact="true" mode="contained" icon="arrow-left" size={28} onPress={close} />
              </View>
            )}
            <Text style={styles.title}>{state.strings.details}</Text>
            {close && <View style={styles.close} />}
          </SafeAreaView>
          <Divider style={styles.divider} />
          {!state.access && <Text style={styles.noAccess}>{state.strings.noAccess}</Text>}
          {state.access && (
            <View style={styles.info}>
              {state.locked && <Text style={styles.encrypted}>{state.strings.encrypted}</Text>}
              {state.host && !state.locked && (
                <Surface style={styles.subject} mode="flag" elevation={4}>
                  <TextInput
                    style={styles.input}
                    underlineStyle={styles.underline}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.editSubject}
                    label={Platform.OS === 'ios' ? state.strings.subject : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.subject : undefined}
                    disabled={state.locked}
                    left={<TextInput.Icon style={styles.icon} icon="label-outline" />}
                    onChangeText={value => actions.setEditSubject(value)}
                  />
                  {state.subject !== state.editSubject && <IconButton style={styles.icon} icon="undo-variant" onPress={actions.undoSubject} />}
                  {state.subject !== state.editSubject && <IconButton style={styles.icon} icon="content-save-outline" loading={saving} onPress={saveSubject} />}
                </Surface>
              )}
              {!state.host && !state.locked && (
                <View style={styles.guestSubject}>
                  <Icon size={28} source="label-outline" />
                  <Text style={styles.itemHeader}>{state.subject}</Text>
                </View>
              )}
              <View style={styles.item}>
                <Icon source="calendar-month-outline" size={20} />
                <Text style={styles.itemLabel}>{state.created}</Text>
              </View>
              {state.host && (
                <View style={styles.item}>
                  <Icon source="home-outline" size={20} />
                  <Text style={styles.itemLabel}>{state.strings.channelHost}</Text>
                </View>
              )}
              {!state.host && (
                <View style={styles.item}>
                  <Icon source="server" size={20} />
                  <Text style={styles.itemLabel}>{state.strings.channelGuest}</Text>
                </View>
              )}
              {state.sealed && (
                <View style={styles.item}>
                  <Icon source="shield-outline" size={20} />
                  <Text style={styles.itemLabel}>{state.strings.sealed}</Text>
                </View>
              )}
              {!state.sealed && (
                <View style={styles.item}>
                  <Icon source="shield-off-outline" size={20} />
                  <Text style={styles.itemLabel}>{state.strings.notSealed}</Text>
                </View>
              )}
            </View>
          )}
          <Divider style={styles.divider} />
          {!state.host && (
            <View style={styles.actions}>
              <View style={styles.action}>
                <IconButton style={styles.actionIcon} loading={removing} compact="true" mode="contained" icon="logout-variant" size={32} onPress={leave} />
                <Text style={styles.actionLabel}>{state.strings.leave}</Text>
              </View>
              <View style={styles.action}>
                <IconButton style={styles.actionIcon} loading={blocking} compact="true" mode="contained" icon="eye-off-outline" size={32} onPress={block} />
                <Text style={styles.actionLabel}>{state.strings.block}</Text>
              </View>
              <View style={styles.action}>
                <IconButton style={styles.actionIcon} loading={reporting} compact="true" mode="contained" icon="alert-octagon-outline" size={32} onPress={report} />
                <Text style={styles.actionLabel}>{state.strings.report}</Text>
              </View>
            </View>
          )}
          {state.host && (
            <View style={styles.actions}>
              <View style={styles.action}>
                <IconButton style={styles.actionIcon} loading={removing} compact="true" mode="contained" icon="message-minus-outline" size={32} onPress={remove} />
                <Text style={styles.actionLabel}>{state.strings.remove}</Text>
              </View>
              <View style={styles.action}>
                <IconButton style={styles.actionIcon} compact="true" mode="contained" icon="account-cog-outline" size={32} onPress={membership} />
                <Text style={styles.actionLabel}>{state.strings.members}</Text>
              </View>
            </View>
          )}
          <Text style={styles.membership}>{state.strings.membership}</Text>
          <Divider style={styles.divider} />
          <ScrollView style={styles.members}>
            {state.hostCard && (
              <Card
                containerStyle={{...styles.card, borderColor: theme.colors.outlineVariant}}
                imageUrl={state.hostCard.imageUrl}
                name={state.hostCard.name}
                placeholder={state.strings.name}
                handle={state.hostCard.handle}
                node={state.hostCard.node}
                actions={[<Icon key="host" source="home-outline" size={20} />]}
              />
            )}
            {state.profile && (
              <Card
                containerStyle={{...styles.card, borderColor: theme.colors.outlineVariant}}
                imageUrl={state.profile.imageUrl}
                name={state.profile.name}
                placeholder={state.strings.name}
                handle={state.profile.handle}
                node={state.profile.node}
                actions={state.host ? [<Icon key="host" source="home-outline" size={20} />] : []}
              />
            )}
            {cards}
            {state.unknownContacts > 0 && (
              <Text style={styles.unknown}>
                {state.strings.unknown}: {state.unknownContacts}
              </Text>
            )}
          </ScrollView>
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
      <Confirm show={confirm} busy={busy} params={confirmParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={memberModal} onRequestClose={() => setMemberModal(false)}>
        <View style={styles.memberModal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={5} mode="flat" style={styles.memberSurface}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{state.strings.editMembership}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setMemberModal(false)} />
            </View>
            <Surface eleveation={2} style={styles.modalArea}>
              {members.length === 0 && (
                <View style={styles.noContacts}>
                  <Text style={styles.noContactsLabel}>{state.strings.noContacts}</Text>
                </View>
              )}
              {members.length > 0 && <ScrollView style={styles.modalMembers}>{members}</ScrollView>}
            </Surface>
            <View style={styles.modalButtons}>
              {error && <Text style={styles.error}>{state.strings.operationFailed}</Text>}
              <Button style={styles.modalButton} compact={true} mode="outlined" onPress={() => setMemberModal(false)}>
                {state.strings.close}
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
