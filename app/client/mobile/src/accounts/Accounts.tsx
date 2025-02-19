import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text, IconButton, Divider, Surface, useTheme} from 'react-native-paper';
import {useAccounts} from './useAccounts.hook';
import {styles} from './Accounts.styled';
import { Card } from '../card/Card';
import { Colors } from '../constants/Colors';
import { Confirm } from '../confirm/Confirm';

export function Accounts({ setup }: { setup: ()=>void }) {
  const { state, actions } = useAccounts();
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const [remove, setRemove] = useState(null);
  const [removeParams, setRemoveParams] = useState({});
  const [removing, setRemoving] = useState(null);
  const [blocking, setBlocking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
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
  }

  const failedParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: ()=>{setFailed(false)},
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
  }

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
          action: () => {setRemove(false)},
        },
      })
      setRemove(true);
    }
  }

  return (
    <View style={styles.accounts}>
      { state.layout === 'large' && (
        <View style={styles.header}>
          <Text style={styles.largeTitle}>{ state.strings.accounts }</Text>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="refresh" onPress={loadAccounts} />
          <IconButton style={styles.icon} loading={false} iconColor={Colors.primary} mode="contained" icon="account-plus-outline" onPress={()=>{}} />
          <IconButton style={styles.icon} loading={false} iconColor={Colors.primary} mode="contained" icon="cog-outline" onPress={setup} />
        </View>
      )}
      { state.layout === 'small' && (
        <View style={styles.header}>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="refresh" onPress={loadAccounts} />
          <Text style={styles.smallTitle}>{ state.strings.accounts }</Text>
          <IconButton style={styles.icon} loading={false} iconColor={Colors.primary} mode="contained" icon="account-plus-outline" onPress={()=>{}} />
        </View>
      )}
      <Divider style={styles.line} bold={true} />
      {state.members.length !== 0 && (
        <FlatList
          style={styles.members}
          data={state.members}
          initialNumToRender={32}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const options = [
              <IconButton key="disable" style={styles.icon} loading={false} iconColor={Colors.primary} mode="contained" icon="lock-open-variant-outline" onPress={()=>{}} />,
              <IconButton key="reset" style={styles.icon} loading={blocking === item.accountId} iconColor={Colors.pending} mode="contained" icon={item.disabled ? 'account-check-outline' : 'account-cancel-outline'} onPress={()=>{blockAccount(item.accountId, !item.disabled)}} />,
              <IconButton key="remove" style={styles.icon} loading={removing === item.accountId} iconColor={Colors.offsync} mode="contained" icon="trash-can-outline" onPress={()=>{removeAccount(item.accountId)}} />
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
                select={()=>{}}
                actions={options}
              />
            );
          }} />
      )}
      {state.members.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.label}>{ state.strings.noAccounts }</Text>
        </View>
      )}
      <Divider style={styles.line} bold={true} />
      <Confirm show={failed} params={failedParams} />
      <Confirm show={remove} busy={removing} params={removeParams} />
    </View>
  );
}

