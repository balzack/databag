import React, {useEffect, useState} from 'react';
import {FlatList, View, TouchableOpacity, Modal} from 'react-native';
import {Text, Button, IconButton, Divider, Surface, Icon, useTheme} from 'react-native-paper';
import {useAccounts} from './useAccounts.hook';
import {styles} from './Accounts.styled';
import {Card} from '../card/Card';
import {Colors} from '../constants/Colors';
import {Confirm} from '../confirm/Confirm';
import {BlurView} from '@react-native-community/blur';
import Clipboard from '@react-native-clipboard/clipboard';

type AccountsLargeProps = {
  setup: () => void;
};

export function AccountsLarge({setup}: AccountsLargeProps) {
  const {state, actions} = useAccounts();
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const [remove, setRemove] = useState(null);
  const [removeParams, setRemoveParams] = useState({});
  const [removing, setRemoving] = useState(null);
  const [blocking, setBlocking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessing, setAccessing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [token, setToken] = useState('');
  const [tokenCopy, setTokenCopy] = useState(false);

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAccounts = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await actions.reload();
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  const accessAccount = async (accountId: number) => {
    if (!accessing) {
      setAccessing(accountId);
      try {
        const access = await actions.accessAccount(accountId);
        setToken(access);
        setShowAccessModal(true);
      } catch (err) {
        console.log(err);
        setFailed(true);
      }
      setAccessing(null);
    }
  };

  const addAccount = async () => {
    if (!adding) {
      setAdding(true);
      try {
        const access = await actions.addAccount();
        setToken(access);
        setShowAddModal(true);
      } catch (err) {
        console.log(err);
        setFailed(true);
      }
      setAdding(false);
    }
  };

  const failedParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setFailed(false);
      },
    },
  };

  const blockAccount = async (accountId: number, block: boolean) => {
    if (!blocking) {
      setBlocking(accountId);
      try {
        await actions.blockAccount(accountId, block);
      } catch (err) {
        console.log(err);
        setFailed(true);
      }
      setBlocking(null);
    }
  };

  const removeAccount = (accountId: number) => {
    if (!remove) {
      setRemoveParams({
        title: state.strings.confirmDelete,
        prompt: state.strings.areSure,
        confirm: {
          label: state.strings.remove,
          action: async () => {
            if (!removing) {
              setRemoving(accountId);
              try {
                await actions.removeAccount(accountId);
              } catch (err) {
                console.log(err);
                setFailed(true);
              }
              setRemoving(false);
              setRemove(false);
            }
          },
        },
        cancel: {
          label: state.strings.cancel,
          action: () => {
            setRemove(false);
          },
        },
      });
      setRemove(true);
    }
  };

  const copyToken = async () => {
    if (!tokenCopy) {
      setTokenCopy(true);
      Clipboard.setString(token);
      setTimeout(() => {
        setTokenCopy(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.component}>
      <View style={styles.accounts}>
        <View style={styles.header}>
          <Text style={styles.largeTitle}>{state.strings.accounts}</Text>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="refresh" onPress={loadAccounts} />
          <IconButton style={styles.icon} loading={adding} iconColor={Colors.primary} mode="contained" icon="account-plus-outline" onPress={addAccount} />
          <IconButton style={styles.icon} loading={false} iconColor={Colors.primary} mode="contained" icon="cog-outline" onPress={setup} />
        </View>
        <Divider style={styles.line} bold={true} />
        {state.members.length !== 0 && (
          <FlatList
            style={styles.members}
            data={state.members}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const options = [
                <IconButton
                  key="disable"
                  style={styles.icon}
                  loading={accessing === item.accountId}
                  iconColor={Colors.primary}
                  mode="contained"
                  icon="lock-open-variant-outline"
                  onPress={() => {
                    accessAccount(item.accountId);
                  }}
                />,
                <IconButton
                  key="reset"
                  style={styles.icon}
                  loading={blocking === item.accountId}
                  iconColor={Colors.pending}
                  mode="contained"
                  icon={item.disabled ? 'account-check-outline' : 'account-cancel-outline'}
                  onPress={() => {
                    blockAccount(item.accountId, !item.disabled);
                  }}
                />,
                <IconButton
                  key="remove"
                  style={styles.icon}
                  loading={removing === item.accountId}
                  iconColor={Colors.offsync}
                  mode="contained"
                  icon="trash-can-outline"
                  onPress={() => {
                    removeAccount(item.accountId);
                  }}
                />,
              ];
              return (
                <Card
                  containerStyle={{
                    ...styles.card,
                    borderColor: theme.colors.outlineVariant,
                  }}
                  imageUrl={item.imageUrl}
                  name={item.storageUsed > 1048576 ? `${item.handle} [${Math.floor(item.storageUsed / 1048576)}MB]` : item.handle}
                  handle={item.guid}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={() => {}}
                  actions={options}
                />
              );
            }}
          />
        )}
        {state.members.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.label}>{state.strings.noAccounts}</Text>
          </View>
        )}
        <Divider style={styles.line} bold={true} />
      </View>
      <Confirm show={failed} params={failedParams} />
      <Confirm show={remove} busy={removing} params={removeParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={showAccessModal} onRequestClose={() => setShowAccessModal(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={4} mode="flat" style={styles.modalSurface}>
            <Text style={styles.modalLabel}>{state.strings.accessingTitle}</Text>
            <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setShowAccessModal(false)} />
            <Text style={styles.modalDescription}>{state.strings.accessingToken}</Text>
            <View style={styles.secretText}>
              <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                {token}
              </Text>
              <TouchableOpacity onPress={copyToken}>
                <Icon style={styles.secretIcon} size={18} source={tokenCopy ? 'check' : 'content-copy'} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalControls}>
              <Button mode="outlined" onPress={() => setShowAccessModal(false)}>
                {state.strings.close}
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={4} mode="flat" style={styles.modalSurface}>
            <Text style={styles.modalLabel}>{state.strings.addingTitle}</Text>
            <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setShowAddModal(false)} />
            <Text style={styles.modalDescription}>{state.strings.addingToken}</Text>
            <View style={styles.secretText}>
              <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                {token}
              </Text>
              <TouchableOpacity onPress={copyToken}>
                <Icon style={styles.secretIcon} size={18} source={tokenCopy ? 'check' : 'content-copy'} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalControls}>
              <Button mode="outlined" onPress={() => setShowAddModal(false)}>
                {state.strings.close}
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
