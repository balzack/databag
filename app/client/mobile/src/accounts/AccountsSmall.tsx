import React, {useEffect, useState} from 'react';
import {FlatList, View, TouchableOpacity, Modal} from 'react-native';
import {Text, Button, TextInput, Menu, IconButton, Surface, Icon, useTheme} from 'react-native-paper';
import {useAccounts} from './useAccounts.hook';
import {styles} from './Accounts.styled';
import {Card} from '../card/Card';
import {Colors} from '../constants/Colors';
import {Confirm} from '../confirm/Confirm';
import {BlurView} from '@react-native-community/blur';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';

export function AccountsSmall() {
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
  const [more, setMore] = useState(null as null | string);

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
    setMore(null);
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
    setMore(null);
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
    setMore(null);
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
      <Surface elevation={1} mode="flat" style={{width: '100%', height: '100%'}}>
        <Surface elevation={9} mode="flat">
          <SafeAreaView edges={['top']}>
            <View
              style={{width: '100%', display: 'flex', flexDirection: 'row', height: 72, gap: 16, justifyContent: 'center', alignItems: 'center', paddingBottom: 16, paddingRight: 16, paddingLeft: 16}}>
              <Surface mode="flat" elevation={0} style={styles.searchSurface}>
                <TextInput
                  dense={true}
                  style={styles.input}
                  outlineStyle={styles.inputBorder}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  mode="outlined"
                  placeholder={state.strings.searchAccounts}
                  left={<TextInput.Icon style={styles.icon} icon="search" />}
                  value={state.filter}
                  onChangeText={value => actions.setFilter(value)}
                />
              </Surface>
              <Button icon="user-plus" mode="contained" textColor="white" style={styles.newContactButton} onPress={addAccount}>
                {state.strings.new}
              </Button>
            </View>
          </SafeAreaView>
        </Surface>

        {state.members.length !== 0 && (
          <FlatList
            style={styles.contacts}
            data={state.filtered}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const action = (
                <Menu
                  key="actions"
                  visible={more === item.accountId}
                  onDismiss={() => setMore(null)}
                  anchor={
                    <IconButton
                      style={styles.action}
                      loading={accessing === item.accountId || blocking === item.accountId || removing === item.accountId}
                      icon="dots-horizontal-circle-outline"
                      size={22}
                      onPress={() => setMore(item.accountId)}
                    />
                  }>
                  <Menu.Item key="storage" leadingIcon="hard-drive" disabled={true} title={`${Math.floor(item.storageUsed / 1048576)} MB`} onPress={() => {}} />
                  <Menu.Item key="access" leadingIcon="lock-open" title={state.strings.accessAccount} onPress={() => accessAccount(item.accountId)} />
                  {item.disabled && <Menu.Item key="enable" leadingIcon="play-circle" title={state.strings.enableAccount} onPress={() => blockAccount(item.accountId, false)} />}
                  {!item.disabled && (
                    <Menu.Item
                      key="enable"
                      leadingIcon="stop-circle"
                      title={state.strings.disableAccount}
                      onPress={() => {
                        console.log(item);
                        blockAccount(item.accountId, true);
                      }}
                    />
                  )}
                  <Menu.Item key="delete" leadingIcon="user-minus" title={state.strings.deleteAccount} onPress={() => removeAccount(item.accountId)} />
                </Menu>
              );
              return (
                <Card
                  containerStyle={{...styles.contact, handle: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  handle={item.handle}
                  node={item.node}
                  placeholder={state.strings.name}
                  select={() => {}}
                  actions={[action]}
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
      </Surface>
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
