import React from 'react';
import {Platform} from 'react-native';

interface LayoutSelectorProps<T> {
  SmallComponent: React.ComponentType<T>;
  LargeComponent: React.ComponentType<T>;
  props: T;
}

export function LayoutSelector<T>({
  SmallComponent,
  LargeComponent,
  props,
}: LayoutSelectorProps<T>) {
  if (Platform.isPad) {
    return <LargeComponent {...props} />;
  }
  return <SmallComponent {...props} />;
}

export function createLayoutComponent<T>(
  SmallComponent: React.ComponentType<T>,
  LargeComponent: React.ComponentType<T>,
) {
  return function LayoutComponent(props: T) {
    return (
      <LayoutSelector
        SmallComponent={SmallComponent}
        LargeComponent={LargeComponent}
        props={props}
      />
    );
  };
}
