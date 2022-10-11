import { useState, useContext } from 'react';
import { ScrollView, View, Alert, TouchableOpacity, Text } from 'react-native';
import { useContact } from './useContact.hook';
import { styles } from './Contact.styled';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function ContactTitle({ contact, closeContact }) {
  const { state, actions } = useContact(contact, closeContact);
  return (<Text style={styles.title}>{ `${state.handle}@${state.node}` }</Text>);
}

export function Contact({ contact, closeContact }) {

  const { state, actions } = useContact(contact, closeContact);

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
  
  const saveContact = () => {
    setContact(actions.saveContact);
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

  const connectContact = () => {
    setContact(actions.connectContact);
  }

  const Body = () => {
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
            <Ionicons name="enviromento" size={14} color={Colors.text} />
            <Text style={styles.locationtext}>{ state.location }</Text>
          </View>
          <View style={styles.attribute}>
            <Ionicons name="book" size={14} color={Colors.text} />
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
            </>
          )}
          { state.status === 'connecting' && (
            <>
              <TouchableOpacity style={styles.button} onPress={disconnectContact}>
                <Text style={styles.buttonText}>Cancel Request</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={closeDelete}>
                <Text style={styles.buttonText}>Delete Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={blockContact}>
                <Text style={styles.buttonText}>Block Contact</Text>
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
            </>
          )}
          { state.status === 'pending' && (
            <>
              <TouchableOpacity style={styles.button} onPress={saveAndConnect}>
                <Text style={styles.buttonText}>Save and Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveContact}>
                <Text style={styles.buttonText}>Save Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={deleteContact}>
                <Text style={styles.buttonText}>Ignore Request</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={blockContact}>
                <Text style={styles.buttonText}>Block Contact</Text>
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
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper}>
      { state.tabbed && (
        <Body />
      )}
      { !state.tabbed && (
        <SafeAreaView style={styles.drawer} edges={['top', 'bottom', 'right']}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{ `${state.handle}@${state.node}` }</Text>
          </View>
          <Body />
        </SafeAreaView>
      )} 
    </ScrollView>
  )
}

