import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
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

export function ContactHeader({ contact }) {
  const handle = contact?.node ? `${contact?.handle}@${contact?.node}` : contact?.handle;
  return (
    <Text style={styles.headerText}>{ handle }</Text>
  )
}

export function ContactBody({ contact }) {

  const { state, actions } = useContact(contact);

  const getStatusText = (status) => {
    if (status === 'confirmed') {
      return 'saved';
    }
    if (status === 'pending') {
      return 'unknown contact request';
    }
    if (status === 'connecting') {
      return 'request sent';
    }
    if (status === 'connected') {
      return 'connected';
    }
    if (status === 'requested') {
      return 'request received';
    }
    return 'unsaved';
  }

  const setContact = async (action) => {
    try {
      await action();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Update Contact',
        'Please try again.',
      );
    }
  }

  const cancelRequest = () => {
    Alert.alert(
      "Closing Request",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Close", onPress: () => {
          setContact(actions.disconnectContact);
        }}
      ]
    );
  }

  const disconnectContact = () => {
    Alert.alert(
      "Disconnecting Contact",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Disconnect", onPress: () => {
          setContact(actions.disconnectContact);
        }}
      ]
    );
  }

  const saveAndConnect = () => {
    setContact(actions.saveAndConnect);
  }

  const confirmAndConnect = () => {
    setContact(actions.confirmAndConnect);
  }
  
  const saveContact = () => {
    setContact(actions.saveContact);
  }
 
  const confirmContact = () => {
    setContact(actions.confirmContact);
  }

  const ignoreContact = () => {
    setContact(actions.ignoreContact);
  }

  const deleteContact = () => {
    Alert.alert(
      "Deleting Contact",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Delete", onPress: () => {
          setContact(actions.deleteContact);
        }}
      ]
    );
  }

  const closeDelete = () => {
    Alert.alert(
      "Deleting Contact",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Delete", onPress: () => {
          setContact(actions.closeDelete);
        }}
      ]
    );
  }

  const blockContact = () => {
    Alert.alert(
      "Blocking Contact",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Block", onPress: () => {
          setContact(actions.blockContact);
        }}
      ]
    );
  }

  const reportContact = () => {
    Alert.alert(
      "Report Contact",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Report", onPress: () => {
          setContact(actions.reportContact);
        }}
      ]
    );
  }

  const connectContact = () => {
    setContact(actions.connectContact);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{ `[${getStatusText(state.status)}]` }</Text> 
      <View style={{ width: 128 }}>
        <Logo src={state.logo} width={128} height={128} radius={8} />
      </View>
      <View style={styles.detail}>
        <View style={styles.attribute}>
          <Text style={styles.nametext}>{ state.name }</Text>
        </View>
        <View style={styles.attribute}>
          <View style={styles.glyph}>
            <Ionicons name="enviromento" size={14} color={Colors.text} />
          </View>
          <Text style={styles.locationtext}>{ state.location }</Text>
        </View>
        <View style={styles.attribute}>
          <View style={styles.glyph}>
            <Ionicons name="book" size={14} color={Colors.text} />
          </View>
          <Text style={styles.descriptiontext}>{ state.description }</Text>
        </View>
      </View>
      <View style={styles.controls}>
        { state.status === 'connected' && (
          <>
            <TouchableOpacity style={styles.button} onPress={disconnectContact}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeDelete}>
              <Text style={styles.buttonText}>Delete Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockContact}>
              <Text style={styles.buttonText}>Block Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
            { state.offsync && (
              <TouchableOpacity style={styles.alert} onPress={actions.resync}>
                <Text>Resync Contact</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        { state.status === 'connecting' && (
          <>
            <TouchableOpacity style={styles.button} onPress={cancelRequest}>
              <Text style={styles.buttonText}>Close Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeDelete}>
              <Text style={styles.buttonText}>Delete Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockContact}>
              <Text style={styles.buttonText}>Block Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
          </>
        )}
        { state.status === 'confirmed' && (
          <>
            <TouchableOpacity style={styles.button} onPress={connectContact}>
              <Text style={styles.buttonText}>Request Connection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteContact}>
              <Text style={styles.buttonText}>Delete Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockContact}>
              <Text style={styles.buttonText}>Block Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
          </>
        )}
        { state.status === 'pending' && (
          <>
            <TouchableOpacity style={styles.button} onPress={confirmAndConnect}>
              <Text style={styles.buttonText}>Save and Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={confirmContact}>
              <Text style={styles.buttonText}>Save Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteContact}>
              <Text style={styles.buttonText}>Ignore Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockContact}>
              <Text style={styles.buttonText}>Block Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
          </>
        )}
        { state.status === 'requested' && (
          <>
            <TouchableOpacity style={styles.button} onPress={connectContact}>
              <Text style={styles.buttonText}>Accept Connection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={ignoreContact}>
              <Text style={styles.buttonText}>Ignore Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={disconnectContact}>
              <Text style={styles.buttonText}>Deny Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteContact}>
              <Text style={styles.buttonText}>Delete Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockContact}>
              <Text style={styles.buttonText}>Block Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
          </>
        )}
        { state.status == null && (
          <>
            <TouchableOpacity style={styles.button} onPress={saveAndConnect}>
              <Text style={styles.buttonText}>Save and Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={saveContact}>
              <Text style={styles.buttonText}>Save Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reportContact}>
              <Text style={styles.buttonText}>Report Contact</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export function Contact({ contact, drawer, back }) {

  const [busy, setBusy] = useState(false);
  const { state, actions } = useContact(contact);
  const OVERLAP = 32;


  const promptDelete = (action) => {
    actions.deletePrompt(async () => {
      if (!busy) {
        try {
          setBusy(true);
          await action();
          setBusy(false);
        }
        catch (err) {
          console.log(err);
          setBusy(false);
          throw err;
        }
      }
    });
  }

  const action = async (method) => {
    if (!busy) {
      try {
        setBusy(true);
        await method();
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  };

  return (
    <>
      { drawer && (
        <Text>CONTACT DRAWER</Text>
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
                <Text style={styles.username} numberOfLines={1}>{ state.username }</Text>
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
                  { state.status === 'saved' && (
                    <View style={styles.statusSaved}>
                      <Text numberOfLines={1} style={styles.statusLabel}>{ state.strings.saved }</Text>
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
                <ScrollView horizontal={true} contentContainerStyle={styles.actionList}>
                  { state.status === 'offsync' && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="sync" style={styles.actionIcon} size={44} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionResync }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.status === 'unsaved' || state.status === 'confirmed') && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <FntIcons name="people-arrows" style={{ ...styles.actionIcon, paddingBottom: 8 }} size={32} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionConnect }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.status === 'received' || state.status === 'pending') && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="account-check-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionAccept }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.status === 'received' || state.status === 'pending') && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="account-remove-outline" style={{ ...styles.actionIcon, paddingBottom: 2 }} size={42} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionIgnore }</Text>
                    </TouchableOpacity>
                  )}
                  { state.status === 'connected' && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="account-cancel-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={42} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionDisconnect }</Text>
                    </TouchableOpacity>
                  )}
                  { state.status === 'connecting' && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MtrIcons name="cancel-schedule-send" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionCancel }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.status === 'pending' || state.status === 'unsaved') && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <IonIcons name="save-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={38} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionSave }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.status === 'connected' || state.status === 'connecting' || state.status === 'received') && (
                    <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptDelete(actions.closeDelete)}>
                      <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                    </TouchableOpacity>
                  )}
                  { state.status === 'confirmed' && (
                    <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptDelete(actions.deleteContact)}>
                      <MatIcons name="trash-can-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionDelete }</Text>
                    </TouchableOpacity>
                  )}
                  { state.status !== 'unsaved' && state.status !== 'pending' && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="block-helper" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={34} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionBlock }</Text>
                    </TouchableOpacity>
                  )}
                  { true && (
                    <TouchableOpacity style={styles.action} activeOpacity={1}>
                      <MatIcons name="account-alert-outline" style={{ ...styles.actionIcon, paddingBottom: 4 }} size={40} color={Colors.linkText} />
                      <Text style={styles.actionLabel}>{ state.strings.actionReport }</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

