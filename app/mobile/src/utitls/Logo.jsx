import { useState } from 'react';
import { Image, View } from 'react-native';
import avatar from 'images/avatar.png';
import appstore from 'images/appstore.png';
import solution from 'images/solution.png';
import team from 'images/team.png';

export function Logo({ src, width, height, radius }) {

  const [source, setSource] = useState(null);

  if (src != source) {
    setSource(src);
  }

  return (
    <View style={{ borderRadius: radius, overflow: 'hidden', width, height }}>
      { source === 'team' && (
        <Image source={team} style={{ width, height }} />
      )}
      { source === 'avatar' && (
        <Image source={avatar} style={{ width, height }} />
      )}
      { source === 'appstore' && (
        <Image source={appstore} style={{ width, height }} />
      )}
      { source === 'solution' && (
        <Image source={solution} style={{ width, height }} />
      )}
      { !source && (
        <Image source={avatar} style={{ width, height }} />
      )}
      { source && source.startsWith('http') && (
        <Image source={{ uri:source }} resizeMode={'contain'} style={{ width, height }} />
      )}
    </View>
  );
}

