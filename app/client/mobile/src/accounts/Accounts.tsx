import React, {useState} from 'react';
import {FlatList, SafeAreaView, Image, View, Pressable} from 'react-native';
import {Text, IconButton, Divider, Surface, useTheme} from 'react-native-paper';
import {useAccounts} from './useAccounts.hook';
import {styles} from './Accounts.styled';
import { Card } from '../card/Card';
import { Colors } from '../constants/Colors';

export function Accounts({ setup }: { setup: ()=>void }) {
  const { state, actions } = useAccounts();
  const theme = useTheme();
  const [loading, setLoading] = useState('');

  return (
    <View style={styles.accounts}>
      { state.layout === 'large' && (
        <View style={styles.header}>
          <Text style={styles.largeTitle}>{ state.strings.accounts }</Text>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="refresh" onPress={()=>{}} />
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="account-plus-outline" onPress={()=>{}} />
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="cog-outline" onPress={setup} />
        </View>
      )}
      { state.layout === 'small' && (
        <View style={styles.header}>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="refresh" onPress={()=>{}} />
          <Text style={styles.smallTitle}>{ state.strings.accounts }</Text>
          <IconButton style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="account-plus-outline" onPress={()=>{}} />
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
              <IconButton key="disable" style={styles.icon} loading={loading} iconColor={Colors.primary} mode="contained" icon="lock-open-variant-outline" onPress={()=>{}} />,
              <IconButton key="reset" style={styles.icon} loading={loading} iconColor={Colors.pending} mode="contained" icon="account-cancel-outline" onPress={()=>{}} />,
              <IconButton key="remove" style={styles.icon} loading={loading} iconColor={Colors.offsync} mode="contained" icon="trash-can-outline" onPress={()=>{}} />
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
    </View>
  );
}

