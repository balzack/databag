import { useState, useContext } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useContact } from './useContact.hook';
import { styles } from './Contact.styled';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function Contact({ contact, closeContact }) {

  const { state, actions } = useContact(contact);

  const getStatusText = (status) => {
    if (status === 'confirmed') {
      return 'Saved';
    }
    if (status === 'pending') {
      return 'Request Reveived';
    }
    if (status === 'connecting') {
      return 'Request Sent';
    }
    if (status === 'connected') {
      return 'Connected';
    }
    return 'Unsaved';
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'right']}>
        { state.tabbed && (
          <View style={styles.close}>
            <TouchableOpacity onPress={closeContact}>
              <Ionicons name={'close'} size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerText}>{ `${state.handle}@${state.node}` }</Text>
        </View>
        <Text style={styles.status}>{ getStatusText(state.status) }</Text> 
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
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Disconnect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Delete Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Block Contact</Text>
              </TouchableOpacity>
            </>
          )}
          { state.status === 'connecting' && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Block</Text>
            </TouchableOpacity>
          )}
          { state.status === 'confirmed' && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Block</Text>
            </TouchableOpacity>
          )}
          { state.status === 'pending' && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Block</Text>
            </TouchableOpacity>
          )}
          { state.status === 'requested' && (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Block</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

