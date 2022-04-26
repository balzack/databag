import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { useNavigate } from "react-router-dom";

const IMAGE_DIM = 256;

export function useProfile() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    description: '',
    location: '',
    imageUrl: null,
    searchable: false,
    modalBusy: false,
    modalName: '',
    modalLocation: '',
    modalDescription: '',
    modalImage: null,
    crop: { w :0, h: 0, x: 0, y: 0 }
  });

  const navigate = useNavigate();
  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);

console.log("ACCOUNT:", account);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
    setModalName: (value) => {
      updateState({ modalName: value });
    },
    setModalLocation: (value) => {
      updateState({ modalLocation: value });
    },
    setModalDescription: (value) => {
      updateState({ modalDescription: value });
    },
    setModalImage: (value) => {
      updateState({ modalImage: value });
    },
    setModalCrop: (w, h, x, y) => {
      updateState({ crop: { w: w, h: h, x: x, y: y } });
    },
    setProfileData: async () => {
      let set = false
      if(!state.modalBusy) {
        updateState({ modalBusy: true });
        try {
          await profile.actions.setProfileData(state.modalName, state.modalLocation, state.modalDescription);
          set = true
        }
        catch (err) {
          window.alert(err)
        }
        updateState({ modalBusy: false });
      }
      return set
    },
    setSearchable: async (flag) => {
      try {
        await account.actions.setSearchable(flag);
      }
      catch (err) {
        window.alert(err);
      }
    },
    setProfileImage: async () => {
      let set = false
      if(!state.modalBusy) {
        updateState({ modalBusy: true });
        try {
          const processImg = () => {
            return new Promise((resolve, reject) => {
              let img = new Image();
              img.onload = () => {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext('2d');
                canvas.width = IMAGE_DIM;
                canvas.height = IMAGE_DIM;
                context.imageSmoothingQuality = "medium";
                context.drawImage(img, state.crop.x, state.crop.y, state.crop.w, state.crop.h,
                    0, 0, IMAGE_DIM, IMAGE_DIM);
                resolve(canvas.toDataURL());
              }
              img.onerror = reject;
              img.src = state.modalImage;
            });
          };
          let dataUrl = await processImg();
          let data = dataUrl.split(",")[1];
          await profile.actions.setProfileImage(data);
          set = true
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ modalBusy: false });
      }
      return set;
    },
  };

  useEffect(() => {
    if (profile?.state?.profile) {
      let identity = profile.state.profile;
      if (identity.image != null) {
        updateState({ imageUrl: profile.actions.profileImageUrl() })
        updateState({ modalImage: profile.actions.profileImageUrl() })
      } else {
        updateState({ imageUrl: '' })
        updateState({ modalImage: null })
      }
      updateState({ name: identity.name });
      updateState({ modalName: identity.name });
      updateState({ handle: identity.handle });
      updateState({ description: identity.description });
      updateState({ modalDescription: identity.description });
      updateState({ location: identity.location });
      updateState({ modalLocation: identity.location });
    }
  }, [profile]);

  useEffect(() => {
    if (account?.state?.status) {
      let status = account.state.status;
      updateState({ searchable: status.searchable });
    }
  }, [account])

  return { state, actions };
}
