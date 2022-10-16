import { useState, useEffect, useContext } from 'react';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import moment from 'moment';
import { useWindowDimensions } from 'react-native';
import Colors from 'constants/Colors';

export function useTopicItem(item) {

  const [state, setState] = useState({
    name: null,
    known: null,
    logo: null,
    timestamp: null,
    message: null,
    carousel: false,
    carouselIndex: 0,
    width: null,
    height: null,
    activeId: null,
    fontSize: 14,
    fontColor: Colors.text,
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ width: dimensions.width, height: dimensions.height });
  }, [dimensions]);

  useEffect(() => {
    const { topicId, detail } = item;
    const { guid, data, status, transform } = detail;

    let name, known, logo;
    const identity = profile.state?.profile;
    if (guid === identity.guid) {
      known = true;
      if (identity.name) {
        name = identity.name;
      }
      else {
        name = `${identity.handle}@${identity.node}`;
      }
      const img = profile.actions.getImageUrl();
      if (img) {
        logo = img;
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      const contact = card.actions.getByGuid(guid);
      if (contact) {
        if (contact.profile.imageSet) {
          logo = card.actions.getCardLogo(contact.cardId, contact.profileRevision);
        }
        else {
          logo = 'avatar';
        }

        known = true;
        if (contact.profile.name) {
          name = contact.profile.name;
        }
        else {
          name = `${contact.handle}@${contact.node}`;
        }
      }
      else {
        name = "unknown";
        known = false;
        logo = 'avatar';
      }
    }

    let message, assets, fontSize, fontColor;
    try {
      const data = JSON.parse(item.detail.data);
      message = data.text;
      assets = data.assets;
      if (data.textSize === 'small') {
        fontSize = 10;
      }
      else if (data.textSize === 'large') {
        fontSize = 20;
      }
      else {
        fontSize = 14;
      }
      if (data.textColor) {
        fontColor = data.textColor;
      }
      else {
        fontColor = Colors.text;
      }
    }
    catch (err) {
      console.log("empty message");
    }


    let timestamp;
    const date = new Date(item.detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      timestamp = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      timestamp = moment(date).format('M/DD');
    }
    else {
      timestamp = moment(date).format('M/DD/YYYY');
    }

    updateState({ logo, name, known, message, fontSize, fontColor, timestamp, transform, status, assets });
  }, [card, item]);

  const actions = {
    showCarousel: (index) => {
      updateState({ carousel: true, carouselIndex: index });
    },
    hideCarousel: () => {
      updateState({ carousel: false });
    },
    setActive: (activeId) => {
      updateState({ activeId });
    },
  };

  return { state, actions };
}

