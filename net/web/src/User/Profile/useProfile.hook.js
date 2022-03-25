import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

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
  const app = useContext(AppContext);

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
          await app.actions.setProfileData(state.modalName, state.modalLocation, state.modalDescription);
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
        await app.actions.setAccountSearchable(flag);
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
                canvas.width = 256;
                canvas.height = 256;
                context.drawImage(img, state.crop.x, state.crop.y, state.crop.w, state.crop.h,
                    0, 0, 256, 256);
                resolve(canvas.toDataURL());
              }
              img.onerror = reject;
              img.src = state.modalImage;
            });
          };
          let dataUrl = await processImg();
          let data = dataUrl.split(",")[1];
          await app.actions.setProfileImage(data);
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
    if (app?.state?.Data?.profile) {
      let profile = app.state.Data.profile;
      if (profile.image != null) {
        updateState({ imageUrl: app.actions.profileImageUrl() })
        updateState({ modalImage: app.actions.profileImageUrl() })
      } else {
        updateState({ imageUrl: '' })
        updateState({ modalImage: null })
      }
      updateState({ name: profile.name });
      updateState({ modalName: profile.name });
      updateState({ handle: profile.handle });
      updateState({ description: profile.description });
      updateState({ modalDescription: profile.description });
      updateState({ location: profile.location });
      updateState({ modalLocation: profile.location });
    }
    if (app?.state?.Data?.status) {
      let status = app.state.Data.status;
      updateState({ searchable: status.searchable });
    }
  }, [app])

  return { state, actions };
}
