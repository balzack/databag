import {useContent} from './useContent.hook';
import {ContentComponent} from './ContentComponent';
import {createLayoutComponent} from '../utils/LayoutSelector';

type ContentProps = {
  share: {filePath: string; mimeType: string};
  layout: string;
  closeAll: () => void;
  openConversation: () => void;
  createConversation: () => void;
  textCard: {cardId: null | string};
};

export const Content = createLayoutComponent<ContentProps>(ContentComponent, ContentComponent, useContent);
