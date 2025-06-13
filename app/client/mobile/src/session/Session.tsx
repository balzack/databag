import React from 'react';
import {useSession} from './useSession.hook';
import {SessionSmall} from './SessionSmall';
import {SessionLarge} from './SessionLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type SessionProps = {
  share: {filePath: string; mimeType: string};
};

export function Session({share}: SessionProps) {
  return (
    <LayoutSelector
      SmallComponent={SessionSmall}
      LargeComponent={SessionLarge}
      props={{share}}
    />
  );
}