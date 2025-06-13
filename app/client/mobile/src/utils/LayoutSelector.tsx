import React from 'react';

interface LayoutSelectorProps<T> {
  layout: 'small' | 'large';
  SmallComponent: React.ComponentType<T>;
  LargeComponent: React.ComponentType<T>;
  props: T;
}

export function LayoutSelector<T>({
  layout,
  SmallComponent,
  LargeComponent,
  props,
}: LayoutSelectorProps<T>) {
  if (layout === 'small') {
    return <SmallComponent {...props} />;
  }
  
  return <LargeComponent {...props} />;
}

export function createLayoutComponent<T>(
  SmallComponent: React.ComponentType<T>,
  LargeComponent: React.ComponentType<T>,
  useStateHook: () => { state: { layout: 'small' | 'large' } }
) {
  return function LayoutComponent(props: T) {
    const { state } = useStateHook();
    
    return (
      <LayoutSelector
        layout={state.layout}
        SmallComponent={SmallComponent}
        LargeComponent={LargeComponent}
        props={props}
      />
    );
  };
}