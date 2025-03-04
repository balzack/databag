import { useEffect } from 'react';
import { View, Animated, useAnimatedValue } from 'react-native';

export function Shimmer({ contentStyle }: { contentStyle: any }) {
  const shimmer = useAnimatedValue(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[{},{opacity: shimmer},]}>
      <View style={contentStyle}></View>
    </Animated.View>
  )
}
