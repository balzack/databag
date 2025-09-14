import React, {useState, useEffect} from 'react';
import {Platform, Pressable, View, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RingContextProvider} from '../context/RingContext';
import {styles} from './Session.styled';
import {IconButton, Surface, Text, Icon, useTheme} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {Settings} from '../settings/Settings';
import {Contacts} from '../contacts/Contacts';
import {Content} from '../content/Content';
import {Registry} from '../registry/Registry';
import {Profile, ContactParams} from '../profile/Profile';
import {Details} from '../details/Details';
import {Conversation} from '../conversation/Conversation';
import {Assemble} from '../assemble/Assemble';
import {Members} from '../members/Members';
import {useSession} from './useSession.hook';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../constants/Colors';
import {Ring} from '../ring/Ring';
import {Call} from '../call/Call';
import {Welcome} from '../welcome/Welcome';
import {Request} from '../request/Request';
import {Ready} from '../ready/Ready';

const ContactStack = createNativeStackNavigator();
const ContentStack = createNativeStackNavigator();
const OnboardStack = createNativeStackNavigator();

function ContentTab({scheme, textCard, contentTab, share}: {scheme: string; textCard: {cardId: null | string}; contentTab: () => void; share: {filePath: string; mimeType: string}}) {
  const openConversation = props => {
    props.navigation.navigate('conversation');
    contentTab();
  };

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContentStack.Navigator initialRouteName="contacts" screenOptions={{headerShown: false}}>
        <ContentStack.Screen name="content" options={{headerBackTitleVisible: false}}>
          {props => (
            <Content
              share={share}
              layout="small"
              textCard={textCard}
              closeAll={() => props.navigation.popToTop()}
              openConversation={() => openConversation(props)}
              createConversation={() => props.navigation.navigate('assemble')}
            />
          )}
        </ContentStack.Screen>
        <ContentStack.Screen name="assemble" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
          {props => <Assemble close={() => props.navigation.goBack()} openConversation={() => props.navigation.replace('conversation')} />}
        </ContentStack.Screen>
        <ContentStack.Screen name="edit" options={{...styles.noHeader, animation: Platform.OS ==='ios' ? 'simple_push' : 'none'}}>
          {props => <Members close={() => props.navigation.goBack()} />}
        </ContentStack.Screen>
        <ContentStack.Screen name="conversation" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
          {props => <Conversation openDetails={() => props.navigation.navigate('details')} close={() => props.navigation.goBack()} />}
        </ContentStack.Screen>
        <ContentStack.Screen name="details" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
          {props => <Details close={() => props.navigation.goBack()} edit={() => props.navigation.navigate('edit')} closeAll={() => props.navigation.popToTop()} />}
        </ContentStack.Screen>
      </ContentStack.Navigator>
    </NavigationContainer>
  );
}

function ContactTab({scheme, textContact, callContact}: {scheme: string; textContact: (cardId: string) => void; callContact: (card: Card) => void}) {
  const [contactParams, setContactParams] = useState({
    guid: '',
  } as ContactParams);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContactStack.Navigator initialRouteName="contacts" screenOptions={{headerShown: false}}>
        <ContactStack.Screen name="contacts" options={{headerBackTitleVisible: false}}>
          {props => (
            <Contacts
              openRegistry={() => {
                props.navigation.navigate('registry');
              }}
              openContact={(params: ContactParams) => {
                setContactParams(params);
                props.navigation.navigate('profile');
              }}
              callContact={callContact}
              textContact={textContact}
            />
          )}
        </ContactStack.Screen>
        <ContactStack.Screen name="registry" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
          {props => (
            <Registry
              close={props.navigation.goBack}
              openContact={(params: ContactParams) => {
                setContactParams(params);
                props.navigation.navigate('profile');
              }}
            />
          )}
        </ContactStack.Screen>
        <ContactStack.Screen name="profile" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
          {props => <Profile close={props.navigation.goBack} params={contactParams} />}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    </NavigationContainer>
  );
}

function Onboarding({scheme}: {scheme: string}) {
  return (
    <SafeAreaView edges={['top']} style={styles.onboard}>
      <Surface elevation={9} mode="flat" style={styles.screen}>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <OnboardStack.Navigator initialRouteName="welcome" screenOptions={{headerShown: false}}>
            <OnboardStack.Screen name="welcome" options={{headerBackTitleVisible: false}}>
              {props => <Welcome next={() => props.navigation.navigate('identity')} />}
            </OnboardStack.Screen>
            <OnboardStack.Screen name="identity" options={{animation: 'fade'}}>
              {props => <Settings setupNav={{back: () => props.navigation.navigate('welcome'), next: () => props.navigation.navigate('request')}} />}
            </OnboardStack.Screen>
            <OnboardStack.Screen name="request" options={{...styles.noHeader, animation: Platform.OS === 'ios' ? 'simple_push' : 'none'}}>
              {props => <Request setupNav={{back: () => props.navigation.navigate('identity'), next: () => props.navigation.navigate('ready')}} />}
            </OnboardStack.Screen>
            <OnboardStack.Screen name="ready" options={{headerBackTitleVisible: false, animation: 'fade'}}>
              {() => <Ready />}
            </OnboardStack.Screen>
          </OnboardStack.Navigator>
        </NavigationContainer>
      </Surface>
    </SafeAreaView>
  );
}

export function SessionSmall({share}: {share: {filePath: string; mimeType: string}}) {
  const {state} = useSession();
  const scheme = useColorScheme();
  const [tab, setTab] = useState('content');
  const [textCard, setTextCard] = useState({cardId: null} as {cardId: null | string});
  const [, setCallCard] = useState({card: null} as {card: null | Card});
  const [dismissed, setDismissed] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [showDisconnected, setShowDisconnected] = useState(false);
  const theme = useTheme();

  const textContact = (cardId: null | string) => {
    setTextCard({cardId});
  };

  const callContact = (card: null | Card) => {
    setCallCard({card});
  };

  const showContent = tab === 'content' ? styles.visible : styles.hidden;
  const showContact = tab === 'contacts' ? styles.visible : styles.hidden;
  const showSettings = tab === 'settings' ? styles.visible : styles.hidden;

  const dismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      setDismissed(false);
    }, 60000);
  };

  const contentTab = () => {
    if (tab !== 'content') {
      setTab('content');
    }
  };

  useEffect(() => {
    if (share) {
      contentTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

  useEffect(() => {
    if (state.appState && !state.sdkState) {
      setDisconnected(true);
      setShowDisconnected(false);
      setTimeout(() => {
        setShowDisconnected(true);
      }, 2000);
    } else {
      setDisconnected(false);
    }
  }, [state.appState, state.sdkState]);

  return (
    <RingContextProvider>
      <View style={styles.session}>
        <Surface elevation={9}>
          <SafeAreaView style={styles.full} edges={['top']}>
            <View style={styles.screen}>
              <Ring />
              <View style={[styles.body, showContent]}>
                <ContentTab share={share} textCard={textCard} scheme={scheme} contentTab={contentTab} />
              </View>
              <View style={[styles.body, showContact]}>
                <ContactTab textContact={textContact} callContact={callContact} scheme={scheme} />
              </View>
              <View style={[styles.body, showSettings]}>
                <Surface mode="flat" elevation={2}>
                  <Settings showLogout={true} />
                </Surface>
              </View>
              <Surface style={styles.tabContainer} elevation={4}>
                <BlurView style={styles.blur} blurType="light" blurAmount={8} reducedTransparencyFallbackColor="dark" />
                <View style={[styles.tabBar, {backgroundColor: theme.colors.bar}]}>
                  <SafeAreaView edges={['bottom']}>
                    <View style={styles.tabs}>
                      {tab === 'content' && (
                        <IconButton
                          style={styles.activeTab}
                          mode="contained"
                          icon={'chat-circle-filled'}
                          size={32}
                          onPress={() => {
                            setTab('content');
                          }}
                        />
                      )}
                      {tab !== 'content' && (
                        <IconButton
                          style={styles.idleTab}
                          mode="contained"
                          icon={'chat-circle'}
                          size={32}
                          onPress={() => {
                            setTab('content');
                          }}
                        />
                      )}
                      {tab === 'contacts' && (
                        <IconButton
                          style={styles.activeTab}
                          mode="contained"
                          icon={'address-book-filled'}
                          size={32}
                          onPress={() => {
                            setTab('contacts');
                          }}
                        />
                      )}
                      {tab !== 'contacts' && (
                        <IconButton
                          style={styles.idleTab}
                          mode="contained"
                          icon={'address-book'}
                          size={32}
                          onPress={() => {
                            setTab('contacts');
                          }}
                        />
                      )}
                      {tab === 'settings' && (
                        <IconButton
                          style={styles.activeTab}
                          mode="contained"
                          icon={'gear-six-filled'}
                          size={32}
                          onPress={() => {
                            setTab('settings');
                          }}
                        />
                      )}
                      {tab !== 'settings' && (
                        <IconButton
                          style={styles.idleTab}
                          mode="contained"
                          icon={'gear-six'}
                          size={32}
                          onPress={() => {
                            setTab('settings');
                          }}
                        />
                      )}
                    </View>
                  </SafeAreaView>
                </View>
              </Surface>
            </View>
          </SafeAreaView>
          {state.showWelcome && <Onboarding scheme={scheme} />}
        </Surface>
        {disconnected && showDisconnected && !dismissed && (
          <View style={styles.alert}>
            <Surface elevation={5} style={styles.alertArea}>
              <Icon color={Colors.offsync} size={20} source="alert-circle-outline" />
              <Text style={styles.alertLabel}>{state.strings.disconnected}</Text>
              <Pressable onPress={dismiss}>
                <Icon color={Colors.offsync} size={20} source="close" />
              </Pressable>
            </Surface>
          </View>
        )}
        <Call />
      </View>
    </RingContextProvider>
  );
}
