import React, {useEffect, useState} from 'react';
import {FlatList, View, Pressable, TouchableOpacity, Modal} from 'react-native';
import {Text, Button, TextInput, Menu, IconButton, Divider, Surface, Icon, useTheme} from 'react-native-paper';
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
    close: {
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
      <Surface elevation={1} mode="flat" style={styles.fullSurface}>
        <Surface elevation={9} mode="flat">
          <SafeAreaView edges={['top', 'left', 'right']}>
            <View style={styles.headerLayout}>
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
              <Button icon="user-plus" loading={adding} mode="contained" textColor="white" style={styles.newContactButton} onPress={addAccount}>
                {state.strings.new}
              </Button>
            </View>
          </SafeAreaView>
        </Surface>

        {state.members.length !== 0 && (
          <FlatList
            style={styles.contacts}
            contentContainerStyle={styles.listPad}
            data={state.filtered}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const action = (
                <Menu
                  mode="flat"
                  elevation={8}
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
                  <Surface elevation={11}>
                    <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={8} reducedTransparencyFallbackSize={theme.colors.name} />
                    <Pressable key="storage" style={styles.menuOption}>
                      <Icon style={styles.button} source="hard-drive" size={24} color={theme.colors.secondary} />
                      <Text style={{color: theme.colors.secondary}}>{`${Math.floor(item.storageUsed / 1048576)} MB`}</Text>
                    </Pressable>
                    <Pressable key="access" style={styles.menuOption} onPress={() => accessAccount(item.accountId)}>
                      <Icon style={styles.button} source="reset" size={24} color={theme.colors.onSecondary} />
                      <Text>{state.strings.resetAccount}</Text>
                    </Pressable>
                    {item.disabled && (
                      <Pressable key="enable" style={styles.menuOption} onPress={() => blockAccount(item.accountId, false)}>
                        <Icon style={styles.button} source="enable-chat" size={24} color={theme.colors.onSecondary} />
                        <Text>{state.strings.enableAccount}</Text>
                      </Pressable>
                    )}
                    {!item.disabled && (
                      <Pressable key="disable" style={styles.menuOption} onPress={() => blockAccount(item.accountId, true)}>
                        <Icon style={styles.button} source="disable-chat" size={24} color={theme.colors.onSecondary} />
                        <Text>{state.strings.disableAccount}</Text>
                      </Pressable>
                    )}
                    <Pressable key="delete" style={styles.menuOption} onPress={() => removeAccount(item.accountId)}>
                      <Icon style={styles.button} source="trash-2" size={24} color={theme.colors.onSecondary} />
                      <Text>{state.strings.deleteAccount}</Text>
                    </Pressable>
                  </Surface>
                </Menu>
              );
              return (
                <Card
                  containerStyle={{...styles.contact, handle: {...styles.contactHandle, color: theme.colors.onSecondary}}}
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
          <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.modalArea}>
            <Surface elevation={1} style={{...styles.modalSurface, backgroundColor: theme.colors.elevation.level12}}>
              <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={2} reducedTransparencyFallbackColor="dark" />
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>{state.strings.resetAccount}</Text>
                <Text style={styles.modalDescription}>{state.strings.accessingToken}</Text>
                <Divider style={styles.divider} />
                <View style={styles.secretText}>
                  <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                    {token}
                  </Text>
                  <TouchableOpacity onPress={copyToken}>
                    <Icon style={styles.secretIcon} size={20} source={tokenCopy ? 'check' : 'content-copy'} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalControls}>
                  <Button style={styles.modalControl} mode="contained" onPress={() => setShowAccessModal(false)}>
                    {state.strings.close}
                  </Button>
                </View>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackColor="dark" />
          <View style={styles.modalArea}>
            <Surface elevation={1} style={{...styles.modalSurface, backgroundColor: theme.colors.elevation.level12}}>
              <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={1} reducedTransparencyFallbackColor="dark" />
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>{state.strings.addAccount}</Text>
                <Text style={styles.modalDescription}>{state.strings.addingToken}</Text>
                <Divider style={styles.divider} />
                <View style={styles.secretText}>
                  <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                    {token}
                  </Text>
                  <TouchableOpacity onPress={copyToken}>
                    <Icon style={styles.secretIcon} size={20} source={tokenCopy ? 'check' : 'content-copy'} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalControls}>
                  <Button style={styles.modalControl} mode="contained" onPress={() => setShowAddModal(false)}>
                    {state.strings.close}
                  </Button>
                </View>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
    </View>
  );
}
