import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';
import avatar from 'images/avatar.png';

export function useProfile() {
  
  const [state, setState] = useState({
    handle: null,
    name: null,
    url: null,
    urlSet: false,
    display: null,
    displaySet: false,
    location: null,
    description: null,
    editImage: null,
    editName: null,
    editLocation: null,
    editDescription: null,
    editProfileImage: false,
    editProfileDetails: false,
    clip: { w: 0, h: 0, x: 0, y: 0 },
    crop: { x: 0, y: 0},
    zoom: 1,
    busy: false,
    strings: {},
    menuStyle: {},
  });

  const IMAGE_DIM = 192;
  const app = useContext(AppContext);
  const settings = useContext(SettingsContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { node, name, handle, location, description, image } = profile.state.identity;
    let url = !image ? null : profile.state.imageUrl;
    let editImage = !image ? avatar : url;
    updateState({ name, location, description, node, handle, url, urlSet: true,
        editName: name, editLocation: location, editDescription: description, editHandle: handle, editImage });
  }, [profile.state]);

  useEffect(() => {
    const { display, strings, menuStyle } = settings.state;
    updateState({ displaySet: true, display, strings, menuStyle });
  }, [settings.state]);

  const actions = {
    logout: app.actions.logout,
    setEditImage: (value) => {
      updateState({ editImage: value });
    },
    setEditProfileImage: () => {
      updateState({ editProfileImage: true });
    },
    clearEditProfileImage: () => {
      updateState({ editProfileImage: false });
    },
    setEditProfileDetails: () => {
      updateState({ editProfileDetails: true });
    },
    clearEditProfileDetails: () => {
      updateState({ editProfileDetails: false });
    },
    setEditImageCrop: (w, h, x, y) => {
      updateState({ clip: { w, h, x, y }});
    },
    setEditName: (editName) => {
      updateState({ editName });
    },
    setEditLocation: (editLocation) => {
      updateState({ editLocation });
    },
    setEditDescription: (editDescription) => {
      updateState({ editDescription });
    },
    setCrop: (crop) => {
      updateState({ crop });
    },
    setZoom: (zoom) => {
      updateState({ zoom });
    },
    setProfileImage: async () => {
      if(!state.busy) {
        updateState({ busy: true });
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
                context.drawImage(img, state.clip.x, state.clip.y, state.clip.w, state.clip.h,
                    0, 0, IMAGE_DIM, IMAGE_DIM);
                resolve(canvas.toDataURL());
              }
              img.onerror = reject;
              img.src = state.editImage;
            });
          };
          let dataUrl = await processImg();
          let data = dataUrl.split(",")[1];
          await profile.actions.setProfileImage(data);
          updateState({ busy: false });
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error('failed to save profile image');
        }
      }
      else {
        throw new Error('save in progress');
      }
    },
    setProfileDetails: async () => {
      if(!state.busy) {
        try {
          updateState({ busy: true });
          await profile.actions.setProfileData(state.editName, state.editLocation, state.editDescription);
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error('failed to save profile details');
        }
      }
      else {
        throw new Error('save in progress');
      }
    },
  };

  return { state, actions };
}

