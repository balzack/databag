import { Image, View } from 'react-native';
import avatar from 'images/avatar.png';
import appstore from 'images/appstore.png';
import solution from 'images/solution.png';
import team from 'images/team.png';

export function Logo({ src, width, height, radius }) {
  return (
    <View style={{ borderRadius: radius, overflow: 'hidden' }}>
      { src === 'team' && (
        <Image source={team} style={{ width, height }} />
      )}
      { src === 'avatar' && (
        <Image source={avatar} style={{ width, height }} />
      )}
      { src === 'appstore' && (
        <Image source={appstore} style={{ width, height }} />
      )}
      { src === 'solution' && (
        <Image source={solution} style={{ width, height }} />
      )}
      { !src && (
        <Image source={avatar} style={{ width, height }} />
      )}
      { src && src.startsWith('http') && (
        <Image source={{ uri:src }} resizeMode={'contain'} style={{ width, height }} />
      )}
    </View>
  );
}

