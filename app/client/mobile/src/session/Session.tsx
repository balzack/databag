import React from 'react';
import {useSession} from './useSession.hook';
import {SessionSmall} from './SessionSmall';
import {SessionLarge} from './SessionLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type SessionProps = {
  share: {filePath: string; mimeType: string};
};

export function Session({share}: SessionProps) {
  const {state} = useSession();

  return (
    <LayoutSelector
      layout={state.layout}
      SmallComponent={SessionSmall}
      LargeComponent={SessionLarge}
      props={{share}}
    />
  );
}