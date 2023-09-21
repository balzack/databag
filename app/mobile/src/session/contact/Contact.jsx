import { useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styles } from './Contact.styled';
import { useContact } from './useContact.hook';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Logo } from 'utils/Logo';
import { Colors } from 'constants/Colors';
import AntIcons from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FntIcons from 'react-native-vector-icons/FontAwesome5';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import MtrIcons from 'react-native-vector-icons/MaterialIcons'; 

export function Contact({ contact, drawer, back }) {

  const [busy, setBusy] = useState(false);
  const { state, actions } = useContact(contact, back);
  const OVERLAP = 32;

  const promptAction = (prompt, action) => {
    prompt(async () => {
      if (!busy) {
        try {
          setBusy(true);
          await action();
          setBusy(false);
        }
        catch (err) {
          console.log(err);
          setBusy(false);
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
          throw err;
        }
      }
    });
  }

  const setAction = async (action) => {
    if (!busy) {
      try {
        setBusy(true);
        await new Promise(r => setTimeout(r, 100));
        await action();
        setBusy(false);
      }
      catch (err) {
        console.log(err);
        setBusy(false);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
    }
  }

  return (
    <>
      { drawer && (
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerHeader} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.username }</Text>
          <View style={styles.drawerFrame}>
            <Image source={state.imageSource} style={styles.drawerLogo} resizeMode={'contain'} />
          </View>
          <View style={styles.drawerStatus}>
            { state.status === 'offsync' && (
              <View style={styles.statusOffsync}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.offsync }</Text>
              </View>
            )}
            { state.status === 'connected' && (
              <View style={styles.statusConnected}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.connected }</Text>
              </View>
            )}
            { state.status === 'connecting' && (
              <View style={styles.statusConnecting}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.connecting }</Text>
              </View>
            )}
            { state.status === 'requested' && (
              <View style={styles.statusRequested}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.requested }</Text>
              </View>
            )}
            { state.status === 'received' && (
              <View style={styles.statusReceived}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.received }</Text>
              </View>
            )}
            { state.status === 'pending' && (
              <View style={styles.statusPending}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.pending }</Text>
              </View>
            )}
            { state.status === 'confirmed' && (
              <View style={styles.statusConfirmed}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.confirmed }</Text>
              </View>
            )}
            { state.status === 'unsaved' && (
              <View style={styles.statusUnsaved}>
                <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.unsaved }</Text>
              </View>
            )}
          </View>
          <View style={styles.drawerName}>
            { state.name && (
              <Text style={styles.drawerNameSet} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.name }</Text>
            )}
            { !state.name && (
              <Text style={styles.drawerNameUnset}>{ state.strings.name }</Text>
            )}
          </View>
          <View style={styles.drawerEntry}>
            <AntIcons name="enviromento" style={styles.drawerIcon} size={20} color={Colors.text} />
            { state.location && (
              <Text style={styles.locationSet}>{ state.location }</Text>
            )}
            { !state.location && (
              <Text style={styles.locationUnset}>Location</Text>
            )}
          </View>
          <View style={styles.drawerEntry}>
            <MatIcons name="book-open-outline" style={styles.drawerDescriptionIcon} size={20} color={Colors.text} />
            { state.description && (
              <Text style={styles.descriptionSet}>{ state.description }</Text>
            )}
            { !state.description && (
              <Text style={styles.descriptionUnset}>Description</Text>
            )}
          </View>
          <View style={styles.drawerDivider} />
          { busy && (
            <ActivityIndicator animating={true} color={Colors.text} size={'large'} />
          )}
          { !busy && (
            <View style={styles.drawerActions}>
              { state.status === 'offsync' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={actions.resync}>
                  <MatIcons name="sync" style={styles.actionIcon} size={44} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionResync }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'unsaved' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.saveAndConnect)}>
                  <FntIcons name="people-arrows" style={{ ...styles.actionIcon, paddingBottom: 8 }} size={32} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionConnect }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'confirmed' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.connectContact)}>
                  <FntIcons name="people-arrows" style={{ ...styles.actionIcon, paddingBottom: 8 }} size={32} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionConnect }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'received' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.connectContact)}>
                  <MatIcons name="account-check-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionAccept }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'pending' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.confirmAndConnect)}>
                  <MatIcons name="account-check-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionAccept }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'received' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.disconnectContact)}>
                  <MatIcons name="account-remove-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionIgnore }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'pending' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.ignoreContact)}>
                  <MatIcons name="account-remove-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionIgnore }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'connected' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.disconnectPrompt, actions.disconnectContact)}>
                  <MatIcons name="account-cancel-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={42} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionDisconnect }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'connecting' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.disconnectContact)}>
                  <MtrIcons name="cancel-schedule-send" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionCancel }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'pending' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.confirmContact)}>
                  <IonIcons name="save-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={38} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionSave }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'unsaved' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.saveContact)}>
                  <IonIcons name="save-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={38} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionSave }</Text>
                </TouchableOpacity>
              )}
              { (state.status === 'connected' || state.status === 'connecting' || state.status === 'received') && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.deletePrompt, actions.closeDelete)}>
                  <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                </TouchableOpacity>
              )}
              { state.status === 'confirmed' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.deletePrompt, actions.deleteContact)}>
                  <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                </TouchableOpacity>
              )}
              { state.status !== 'unsaved' && state.status !== 'pending' && (
                <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.blockPrompt, actions.blockContact)}>
                  <MatIcons name="block-helper" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={34} color={Colors.linkText} />
                  <Text style={styles.actionLabel}>{ state.strings.actionBlock }</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.reportPrompt, actions.reportContact)}>
                <MatIcons name="account-alert-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={40} color={Colors.linkText} />
                <Text style={styles.actionLabel}>{ state.strings.actionReport }</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      { !drawer && (
        <View style={styles.container}>
          <Image style={{ ...styles.logo, width: state.imageWidth, height: state.imageHeight }}
            source={state.imageSource} resizeMode={'contain'} />
          <View style={styles.content}>
            <View style={{ ...styles.space, width: state.imageWidth, height: state.imageHeight - OVERLAP }}>
              <TouchableOpacity style={styles.back} onPress={back}>
                <Text style={styles.backLabel}>{ state.strings.back }</Text>
              </TouchableOpacity>
            </View>
            <View style={{ ...styles.details, width: state.detailWidth }}>
              { state.name && (
                <Text style={styles.nameSet} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.name }</Text>
              )}
              { !state.name && (
                <Text style={styles.nameUnset}>{ state.strings.name }</Text>
              )}
              <View style={styles.usernameStatus}>
                <Text style={styles.username} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.username }</Text>
                <View style={styles.status}>
                  { state.status === 'offsync' && (
                    <View style={styles.statusOffsync}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.offsync }</Text>
                    </View>
                  )}
                  { state.status === 'connected' && (
                    <View style={styles.statusConnected}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.connected }</Text>
                    </View>
                  )}
                  { state.status === 'connecting' && (
                    <View style={styles.statusConnecting}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.connecting }</Text>
                    </View>
                  )}
                  { state.status === 'requested' && (
                    <View style={styles.statusRequested}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.requested }</Text>
                    </View>
                  )}
                  { state.status === 'received' && (
                    <View style={styles.statusReceived}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.received }</Text>
                    </View>
                  )}
                  { state.status === 'pending' && (
                    <View style={styles.statusPending}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.pending }</Text>
                    </View>
                  )}
                  { state.status === 'confirmed' && (
                    <View style={styles.statusConfirmed}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.confirmed }</Text>
                    </View>
                  )}
                  { state.status === 'unsaved' && (
                    <View style={styles.statusUnsaved}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.unsaved }</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.attributes}>
                <View style={styles.entry}>
                  <AntIcons name="enviromento" style={styles.icon} size={20} color={Colors.text} />
                  { state.location && (
                    <Text style={styles.locationSet}>{ state.location }</Text>
                  )}
                  { !state.location && (
                    <Text style={styles.locationUnset}>Location</Text>
                  )}
                </View>
                <View style={styles.divider} />
                <ScrollView style={styles.description}>
                  <View style={styles.entry}>
                  <MatIcons name="book-open-outline" style={styles.descriptionIcon} size={20} color={Colors.text} />
                  { state.description && (
                    <Text style={styles.descriptionSet}>{ state.description }</Text>
                  )}
                  { !state.description && (
                    <Text style={styles.descriptionUnset}>Description</Text>
                  )}
                  </View>
                </ScrollView>
              </View>
              <View style={styles.actions}>
                { busy && (
                  <View style={styles.busy}>
                    <ActivityIndicator animating={true} color={Colors.primaryButtonText} size={'large'} />
                  </View>
                )}
                { !busy && (
                  <ScrollView horizontal={true} contentContainerStyle={styles.actionList}>
                    { state.status === 'offsync' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={actions.resync}>
                        <MatIcons name="sync" style={styles.actionIcon} size={40} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionResync }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'unsaved' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.saveAndConnect)}>
                        <FntIcons name="people-arrows" style={{ ...styles.actionIcon, paddingBottom: 8 }} size={28} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionConnect }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'confirmed' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.connectContact)}>
                        <FntIcons name="people-arrows" style={{ ...styles.actionIcon, paddingBottom: 8 }} size={28} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionConnect }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'received' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.connectContact)}>
                        <MatIcons name="account-check-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={38} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionAccept }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'pending' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.confirmAndConnect)}>
                        <MatIcons name="account-check-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={38} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionAccept }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'received' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.disconnectContact)}>
                        <MatIcons name="account-remove-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={38} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionIgnore }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'pending' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.ignoreContact)}>
                        <MatIcons name="account-remove-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={38} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionIgnore }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'connected' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.disconnectPrompt, actions.disconnectContact)}>
                        <MatIcons name="account-cancel-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={38} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionDisconnect }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'connecting' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.disconnectContact)}>
                        <MtrIcons name="cancel-schedule-send" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={36} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionCancel }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'pending' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.confirmContact)}>
                        <IonIcons name="save-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={34} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionSave }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'unsaved' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => setAction(actions.saveContact)}>
                        <IonIcons name="save-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={34} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionSave }</Text>
                      </TouchableOpacity>
                    )}
                    { (state.status === 'connected' || state.status === 'connecting' || state.status === 'received') && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.deletePrompt, actions.closeDelete)}>
                        <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={36} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status === 'confirmed' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.deletePrompt, actions.deleteContact)}>
                        <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={36} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                      </TouchableOpacity>
                    )}
                    { state.status !== 'unsaved' && state.status !== 'pending' && (
                      <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.blockPrompt, actions.blockContact)}>
                        <MatIcons name="block-helper" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={30} color={Colors.linkText} />
                        <Text style={styles.actionLabel}>{ state.strings.actionBlock }</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.reportPrompt, actions.reportContact)}>
                      <MatIcons name="account-alert-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={36} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionReport }</Text>
                    </TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

