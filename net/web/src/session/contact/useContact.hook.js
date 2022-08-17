import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { ViewportContext } from 'context/ViewportContext';
import { getListingImageUrl } from 'api/getListingImageUrl';

export function useContact(guid, listing) {

  const [state, setState] = useState({
    logo: null,
    name: null,
    location: null,
    description: null,
    handle: null,
    removed: false,
    init: false,
  });

  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);
  const viewport = useContext(ViewportContext);  

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let logo, name, location, description, handle;
    let contact = card.actions.getCardByGuid(guid);
    if (contact) {
      let cardProfile = contact?.data?.cardProfile;
      if (cardProfile.node != profile.state.profile.node) {
        handle = cardProfile.handle + '@' + cardProfile.node;
      }
      else {
        handle = cardProfile.handle;
      }
      logo = card.actions.getImageUrl(contact.id);
      name = cardProfile.name;
      location = cardProfile.location;
      description = cardProfile.description;
    }
    else if (listing) {
      if (listing.node != profile.state.profile.node) {
        handle = listing.handle + '@' + listing.node;
      }
      else {
        handle = listing.handle;
      }
      logo = listing.imageSet ? getListingImageUrl(listing.node, listing.guid) : null;
      name = listing.name;
      location = listing.location;
      description = listing.description;
    }
    else {
      updateState({ removed: true });
    }
    updateState({ init: true, logo, name, location, description, handle });
  }, [card, guid, listing]); 

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  const actions = {
  };

  return { state, actions };
}

