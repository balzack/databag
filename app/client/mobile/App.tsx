import React, { useState, useEffect } from 'react';
import {View, StatusBar} from 'react-native';
import {AppContextProvider} from './src/context/AppContext';
import {DisplayContextProvider} from './src/context/DisplayContext';
import {Routes, Route, MemoryRouter} from 'react-router-dom';
import {Root} from './src/root/Root';
import {Access} from './src/access/Access';
import {Service} from './src/service/Service';
import {Session} from './src/session/Session';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ChatTeardropSlash, ChatTeardrop, ArrowCounterClockwise, Camera, EnvelopeSimple, Warning, HouseSimple, Star, HardDrive, LockOpen, UserMinus, PlayCircle, StopCircle, UsersFour, DotsThreeCircle, VideoCamera, VideoCameraSlash, ArrowsInSimple, BellSlash, Phone, Microphone, MicrophoneSlash, FrameCorners, WarningCircle, Link, LinkBreak, AddressBook, ChatCircle, GearSix} from 'phosphor-react-native';
import {useColorScheme} from 'react-native';
import {MD3LightTheme, MD3DarkTheme, PaperProvider} from 'react-native-paper';

const databagColors = {
  light: {
    name: 'light',
    primary: '#224433',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(142, 247, 193)',
    onPrimaryContainer: 'rgb(0, 33, 19)',
    secondary: '#888888',
    onSecondary: '#448866',
    secondaryContainer: 'rgb(255, 223, 160)',
    onSecondaryContainer: 'rgb(38, 26, 0)',
    tertiary: 'rgb(60, 100, 114)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(192, 233, 250)',
    onTertiaryContainer: 'rgb(0, 31, 40)',
    error: '#B22626',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(251, 253, 248)',
    onBackground: 'rgb(4, 4, 4)',
    surface: 'rgb(251, 253, 248)',
    onSurface: '#224433',
    surfaceVariant: 'rgb(220, 229, 220)',
    onSurfaceVariant: 'rgb(64, 73, 67)',
    outline: 'rgb(112, 121, 114)',
    outlineVariant: '#8FBEA7',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(46, 49, 46)',
    inverseOnSurface: 'rgb(239, 241, 237)',
    inversePrimary: 'rgb(113, 218, 166)',
    elevation: {
      level0: 'rgb(255, 255, 255)',
      level1: 'rgb(240, 245, 242)',
      level2: '#F0F5F2',
      level3: 'rgb(216, 216, 216)',
      level4: 'rgb(208, 208, 208)',
      level5: 'rgb(200, 200, 200)',
      level6: 'rgb(200, 200, 200)',
      level7: 'rgb(200, 200, 200)',
      level8: 'transparent',
      level9: '#8FBEA7',
      level10: '#377753',
      level11: 'rgba(255, 255, 255, 0.4)',
      level12: 'rgba(230,234, 232,0.4)',
    },
    surfaceDisabled: 'rgba(25, 28, 26, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 26, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
    base: '#8fbea7',
    bar: 'rgba(240, 245, 242, 0.8)',
    connected: '#18A42B',
    requested: '#EDB612',
    pending: '#dd8800',
    unsaved: '#888888',
    offsync: '#aa0000',
    connecting: '#2288dd',
    confirmed: '#6688cc',
    textColor: '#224433',
    modalBack: 'rgba(0,0,0,0.4)',
  },
  dark: {
    name: 'dark',
    primary: '#227744',
    onPrimary: 'rgb(0, 56, 35)',
    primaryContainer: 'rgb(0, 82, 52)',
    onPrimaryContainer: 'rgb(142, 247, 193)',
    secondary: '#888888',
    onSecondary: '#448866',
    secondaryContainer: 'rgb(92, 67, 0)',
    onSecondaryContainer: 'rgb(255, 223, 160)',
    tertiary: 'rgb(164, 205, 221)',
    onTertiary: 'rgb(5, 53, 66)',
    tertiaryContainer: 'rgb(35, 76, 89)',
    onTertiaryContainer: 'rgb(192, 233, 250)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(60,60,60)',
    onBackground: 'rgb(225, 227, 223)',
    surface: 'rgb(255, 28, 26)',
    onSurface: 'rgb(225, 227, 223)',
    surfaceVariant: 'rgb(64, 73, 67)',
    onSurfaceVariant: 'rgb(192, 201, 193)',
    outline: 'rgb(138, 147, 140)',
    outlineVariant: 'rgb(64, 73, 67)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(225, 227, 223)',
    inverseOnSurface: 'rgb(46, 49, 46)',
    inversePrimary: 'rgb(0, 108, 71)',
    elevation: {
      level0: 'rgb(0, 0, 0)',
      level1: 'rgb(16,16,16)',
      level2: 'rgb(32, 32, 32)',
      level3: 'rgb(48, 48, 48)',
      level4: 'rgb(64, 64, 64)',
      level5: 'rgb(80, 80, 80)',
      level6: 'rgb(200, 200, 200)',
      level7: 'rgb(200, 200, 200)',
      level8: 'transparent',
      level9: '#191919',
      level10: '#224433',
      level11: 'rgba(80, 80, 80, 0.5)',
      level12: 'rgba(96,096,96, 0.5)',
    },
    surfaceDisabled: 'rgba(225, 227, 223, 0.12)',
    onSurfaceDisabled: 'rgba(225, 227, 223, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
    base: 'rgb(0,0,0)',
    bar: 'rgba(16, 10, 8, 0.8)',
    connected: '#18A42B',
    requested: '#EDB612',
    pending: '#dd8800',
    unsaved: '#888888',
    offsync: '#aa0000',
    connecting: '#2288dd',
    confirmed: '#6688cc',
    textColor: '#224433',
    modalBack: 'rgba(0,0,0,0.4)',
  },
};

function FontMix(props: {name: string, color: string}) {
  if (props.name === 'rolodex') {
    props.name = 'contacts';
    return <AntIcon {...props} />;
  }
  else if (props.name === 'left' || props.name === 'idcard' || props.name === 'picture' || props.name === 'message1') {
    return <AntIcon {...props} />;
  } else if (props.name === 'message-circle' || props.name === 'server' || props.name === 'lock' || props.name === 'eye' || props.name === 'eye-off' || props.name === 'settings' || props.name === 'map-pin' || props.name === 'book' || props.name === 'user-plus' || props.name === 'key' || props.name === 'trash-2' || props.name === 'calendar' || props.name === 'clock' || props.name === 'user' || props.name === 'users' || props.name === 'message-circle' || props.name === 'github' || props.name === 'align-left' || props.name === 'edit' || props.name === 'log-out' || props.name === 'search' || props.name === 'filter' || props.name === 'plus-square' || props.name === 'send') {
    return <FeatherIcon {...props} />;
  } else if (props.name === 'sensor-occupied') {
    return <MaterialIcon {...props}  />;
  } else if (props.name === 'address-book') {
    return <AddressBook color={props.color} size={props.size} />;
  } else if (props.name === 'address-book-filled') {
    return <AddressBook weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'chat-circle') {
    return <ChatCircle color={props.color} size={props.size} />;
  } else if (props.name === 'chat-circle-filled') {
    return <ChatCircle weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'gear-six') {
    return <GearSix color={props.color} size={props.size} />;
  } else if (props.name === 'gear-six-filled') {
    return <GearSix weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'link') {
    return <Link color={props.color} size={props.size} />;
  } else if (props.name === 'link-break') {
    return <LinkBreak color={props.color} size={props.size} />;
  } else if (props.name === 'warning-circle') {
    return <WarningCircle weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'frame-corners') {
    return <FrameCorners color={props.color} size={props.size} />;
  } else if (props.name === 'microphone-slash') {
    return <MicrophoneSlash color={props.color} size={props.size} />;
  } else if (props.name === 'microphone') {
    return <Microphone color={props.color} size={props.size} />;
  } else if (props.name === 'phone') {
    return <Phone color={props.color} size={props.size} />;
  } else if (props.name === 'bell-slash') {
    return <BellSlash color={props.color} size={props.size} />;
  } else if (props.name === 'arrows-in') {
    return <ArrowsInSimple color={props.color} size={props.size} />;
  } else if (props.name === 'video') {
    return <VideoCamera color={props.color} size={props.size} />;
  } else if (props.name === 'video-slash') {
    return <VideoCameraSlash color={props.color} size={props.size} />;
  } else if (props.name === 'dots-horizontal-circle-outline') {
    return <DotsThreeCircle color={props.color} size={props.size} />;
  } else if (props.name === 'users-four') {
    return <UsersFour color={props.color} size={props.size} />;
  } else if (props.name === 'users-four-filled') {
    return <UsersFour weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'hard-drive') {
    return <HardDrive color={props.color} size={props.size} />;
  } else if (props.name === 'lock-open') {
    return <LockOpen color={props.color} size={props.size} />;
  } else if (props.name === 'user-minus') {
    return <UserMinus color={props.color} size={props.size} />;
  } else if (props.name === 'play-circle') {
    return <PlayCircle color={props.color} size={props.size} />;
  } else if (props.name === 'stop-circle') {
    return <StopCircle color={props.color} size={props.size} />;
  } else if (props.name === 'award') {
    return <HouseSimple color={props.color} size={props.size} />;
  } else if (props.name === 'warning') {
    return <Warning color={props.color} size={props.size} />;
  } else if (props.name === 'star') {
    return <Star color={props.color} size={props.size} />;
  } else if (props.name === 'star-filled') {
    return <Star weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'mail-filled') {
    return <EnvelopeSimple weight="fill" color={props.color} size={props.size} />;
  } else if (props.name === 'camera') {
    return <Camera color={props.color} size={props.size} />;
  } else if (props.name === 'mail') {
    return <EnvelopeSimple color={props.color} size={props.size} />;
  } else if (props.name === 'reset') {
    return <ArrowCounterClockwise color={props.color} size={props.size} />;
  } else if (props.name === 'enable-chat') {
    return <ChatTeardrop color={props.color} size={props.size} />;
  } else if (props.name === 'disable-chat') {
    return <ChatTeardropSlash color={props.color} size={props.size} />;
  } else {
    return <CommunityIcon {...props} />;
  }
}

function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [share, setShare] = useState(null as null | { filePath: string, mimeType: string });

  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(files => {
      if (files && files.length) {
        const { filePath, mimeType } = files[0];
        setShare({ filePath: filePath.startsWith('file') ? filePath : `file://${filePath}`, mimeType });
      }
    },
    (error) =>{
      console.log(error);
    },
    'databag'
    );
    return () => {ReceiveSharingIntent.clearReceivedFiles(); };
  }, []);

  const fonts = {
    default: {fontFamily: 'Inter-Regular', fontSize: 16, fontWeight: '400', letterSpacing: 0},
    bodyLarge: {fontFamily: 'Inter-Regular', fontSize: 16, fontWeight: '400', letterSpacing: 0.15, lineHeight: 24},
    bodyMedium: {fontFamily: 'Inter-Regular', fontSize: 16, fontWeight: '400', letterSpacing: 0.25, lineHeight: 20},
    bodySmall: {fontFamily: 'Inter-Regular', fontSize: 12, fontWeight: '400', letterSpacing: 0.4, lineHeight: 16},
    displayLarge: {fontFamily: 'Inter-Regular', fontSize: 57, fontWeight: '400', letterSpacing: 0, lineHeight: 64},
    displayMedium: {fontFamily: 'Inter-Regular', fontSize: 45, fontWeight: '400', letterSpacing: 0, lineHeight: 52},
    displaySmall: {fontFamily: 'Inter-Regular', fontSize: 36, fontWeight: '400', letterSpacing: 0, lineHeight: 36},
    headlineLarge: {fontFamily: 'Inter-Regular', fontSize: 32, fontWeight: '500', letterSpacing: 0, lineHeight: 32},
    headlineMedium: {fontFamily: 'Inter-Regular', fontSize: 28, fontWeight: '500', letterSpacing: 0, lineHeight: 32},
    headlineSmall: {fontFamily: 'Inter-Regular', fontSize: 23, fontWeight: '500', letterSpacing: 0, lineHeight: 24},
    labelLarge: {fontFamily: 'Inter-Regular', fontSize: 16, fontWeight: '600', letterSpacing: 0.1, lineHeight: 20},
    labelMedium: {fontFamily: 'Inter-Regular', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, lineHeight: 16},
    labelSmall: {fontFamily: 'Inter-Regular', fontSize: 11, fontWeight: '600', letterSpacing: 0.5, lineHeight: 16},
    titleLarge: {fontFamily: 'Inter-Regular', fontSize: 48, fontWeight: '900', letterSpacing: 0.25, lineHeight: 48},
    titleMedium: {fontFamily: 'Inter-Regular', fontSize: 32, fontWeight: '900', letterSpacing: 0.15, lineHeight: 32},
    titleSmall: {fontFamily: 'Inter-Regular', fontSize: 28, fontWeight: '900', letterSpacing: 0.1, lineHeight: 28},
  };

  const theme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: databagColors.dark, fonts }
      : {...MD3LightTheme, colors: databagColors.light, fonts };

  barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';
  backgroundColor = colorScheme === 'dark' ? databagColors.dark.elevation.level3 : databagColors.light.elevation.level3;

  return (
    <AppContextProvider>
      <DisplayContextProvider>
        <PaperProvider settings={{icon: FontMix}} theme={theme}>
          <MemoryRouter>
            <StatusBar />
            <Root />
            <Routes>
              <Route path="/" element={<View />} />
              <Route path="/access" element={<Access />} />
              <Route path="/service" element={<Service />} />
              <Route path="/session" element={<Session share={share} />} />
            </Routes>
          </MemoryRouter>
        </PaperProvider>
      </DisplayContextProvider>
    </AppContextProvider>
  );
}

export default App;
