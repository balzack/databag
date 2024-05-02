import React, { useState, useEffect, useContext } from 'react';
import {render, act, screen, waitFor, fireEvent} from '@testing-library/react'
import { UploadContextProvider, UploadContext } from 'context/UploadContext';
import axios from 'axios';

let uploadContext = null;
function UploadView() {
  const [renderCount, setRenderCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [channel, setChannel] = useState();
  const upload = useContext(UploadContext);
  uploadContext = upload;

  useEffect(() => {
    setRenderCount(renderCount + 1);

    upload.state.progress.forEach((value, key) => {
      value.forEach(topic => {
        if (topic.active?.total > total) {
          setTotal(topic.active?.total);
        };
      });
      setChannel(key);
    });

  }, [upload.state]);

  return (
    <div>
      <span data-testid="count">{ renderCount }</span>
      <span data-testid="channel">{ channel }</span>
      <span data-testid="total">{ total }</span>
    </div>
  );
}

function UploadTestApp() {
  return (
    <UploadContextProvider>
      <UploadView />
    </UploadContextProvider>
  )
}

const realPost = axios.post;
let asset;

beforeEach(() => {
  asset = {};

  const mockPost = jest.fn().mockImplementation(async (url, data, options) => {
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 10));
      options.onUploadProgress({ loaded: i * 11, total: 111 });
    }

    return Promise.resolve({ data: asset });
  });
  axios.post = mockPost;
});

afterEach(() => {
  axios.post = realPost;
});

test('uploading assets', async () => {
  let setComplete;
  render(<UploadTestApp />);

  await waitFor(async () => {
    expect(uploadContext).not.toBe(null);
  });

  asset = [ { assetId: '3', transform: 'acopy;audio', status: 'pending' } ];

  setComplete = false;
  await act(async () => {
    uploadContext.actions.addTopic('asdf', '123', '1', [{audio: 'asdf'}], ()=>{setComplete=true}, ()=>{});
  });

  await waitFor(async () => {
    expect(setComplete).toBe(true);
    expect(screen.getByTestId('total').textContent).toBe('111');
    expect(screen.getByTestId('channel').textContent).toBe(':123');
  });

  setComplete = false;
  await act(async () => {
    uploadContext.actions.addTopic('asdf', '123', '1', [{audio: 'asdf'}], ()=>{setComplete=true}, ()=>{}, { server: 'test.org', token: '0011', cardId: '96' });
  });

  await waitFor(async () => {
    expect(setComplete).toBe(true);
    expect(screen.getByTestId('channel').textContent).toBe('96:123');
  });

});



