import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import avatar from 'images/avatar.png';

export function useProfile() {
  
  const [state, setState] = useState({
    init: false,
    editProfileImage: false,
    name: null,
    location: null,
    description: null,
    editImage: null,
    editName: null,
    editLocation: null,
    editDescription: null,
    crop: { w: 0, h: 0, x: 0, y: 0 },
    busy: false,
    searchable: null,
  });

  const IMAGE_DIM = 256;
  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);
  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);  

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile.state.init) {
      const { node, name, handle, location, description, image } = profile.state.profile;
      let url = !image ? null : profile.actions.profileImageUrl();
      let editImage = !image ? avatar : url;
      updateState({ init: true, name, node, handle, url, editImage, location, description });
    }
  }, [profile]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    if (account?.state?.status) {
      updateState({ searchable: account.state.status.searchable });
    }
  }, [account]);

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
      updateState({ crop: { w, h, x, y }});
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
                context.drawImage(img, state.crop.x, state.crop.y, state.crop.w, state.crop.h,
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
    setSearchable: async (flag) => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          await account.actions.setSearchable(flag);
          updateState({ busy: false });
        }
        catch (err) {
          console.log(err);
          throw new Error('failed to set searchable');
          updateState({ busy: false });
        }
      }
    },
  };

  return { state, actions };
}

