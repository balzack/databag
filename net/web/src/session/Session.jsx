import { useRef, useState, useEffect } from 'react';
import { Modal, Drawer, Spin } from 'antd';
import { CallingWrapper, RingingWrapper, SessionWrapper } from './Session.styled';
import { useSession } from './useSession.hook';
import { Conversation } from './conversation/Conversation';
import { Details } from './details/Details';
import { Identity } from './identity/Identity';
import { Channels } from './channels/Channels';
import { Cards } from './cards/Cards';
import { Contact } from './contact/Contact';
import { Profile } from './account/profile/Profile';
import { Listing } from './listing/Listing';
import { Account } from './account/Account';
import { Welcome } from './welcome/Welcome';
import { BottomNav } from './bottomNav/BottomNav';
import { Logo } from 'logo/Logo';
import { EyeInvisibleOutlined, CloseOutlined, PhoneOutlined } from '@ant-design/icons';
import { IoVideocamOffOutline, IoVideocamOutline, IoMicOffOutline, IoMicOutline, IoCallOutline } from "react-icons/io5";

export function Session() {

  const { state, actions } = useSession();
  const [ringing, setRinging] = useState([]);
  const [callWidth, setCallWidth] = useState(256);
  const [callHeight, setCallHeight] = useState(256);
  const remote = useRef();
  const local = useRef();

  useEffect(() => {
    let incoming = [];
    for (let i = 0; i < state.ringing.length; i++) {
      const ring = state.ringing[i];
      const label = ring.name ? ring.name : `${ring.handle}@${ring.node}`;
      incoming.push(
        <div className="ringing-entry">
          <Logo url={ring.img} width={40} height={40} radius={4} />
          <div className="ringing-name">{ label }</div>
          <div onClick={() => actions.ignore(ring)} className="ringing-ignore"><EyeInvisibleOutlined /></div>
          <div onClick={() => actions.decline(ring)} className="ringing-decline"><PhoneOutlined /></div>
          <div onClick={() => actions.accept(ring)} className="ringing-accept"><PhoneOutlined /></div>
        </div>
      );
    }
    setRinging(incoming);
  }, [state.ringing]);

  const getWidth = () => {
    if (state.remoteVideo) {
      return callWidth;
    }
    return 256;
  }

  const getHeight = () => {
    if (state.remoteVideo) {
      return callHeight;
    }
    return 256;
  }

  useEffect(() => {
    if (remote.current) {
      remote.current.onloadedmetadata = (ev) => {
        const { videoWidth, videoHeight } = ev.target || { videoWidth: 256, videoHeight: 256 }
        if ((window.innerWidth * 8) / 10 < videoWidth) {
          const scaledWidth = window.innerWidth * 8 / 10;
          const scaledHeight = videoHeight * (scaledWidth / videoWidth)
          if ((window.innerHeight * 8) / 10 < scaledHeight) {
            const height = (window.innerHeight * 8) / 10;
            setCallHeight(height);
            setCallWidth(videoWidth * (height / videoHeight));
          }
          else {
            setCallHeight(scaledHeight);
            setCallWidth(scaledWidth);
          }
        }
        else if ((window.innerHeight * 8) / 10 < videoHeight) {
          const height = (window.innerHeight * 8) / 10;
          setCallHeight(height);
          setCallWidth(videoWidth * (height / videoHeight));
        }
        else {
          setCallHeight(videoHeight);
          setCallWidth(videoWidth);
        }
      };
      remote.current.srcObject = state.remoteStream;
      remote.current.play();
    }
    else {
      console.log("video player not set");
    }
  }, [state.remoteStream]);

  useEffect(() => {
    if (local.current) {
      local.current.srcObject = state.localStream;
      local.current.play();
    }
  }, [state.localStream]);

  useEffect(() => {
    console.log("DIM: ", callWidth, callHeight);
  }, [callWidth, callHeight]);

  const closeAccount = () => {
    actions.closeProfile();
    actions.closeAccount();
  }

  const openAccount = () => {
    actions.openAccount();
    actions.closeCards();
    actions.closeContact();
    actions.closeListing();
  }

  const closeCards = () => {
    actions.closeCards();
    actions.closeContact();
    actions.closeListing();
  }

  const openCards = () => {
    actions.openCards();
    actions.closeProfile();
    actions.closeAccount();
  }

  const openConversation = (channelId, cardId) => {
    actions.openConversation(channelId, cardId);
    actions.closeCards();
    actions.closeContact();
    actions.closeAccount();
    actions.closeProfile();
  }

  const closeConversation = () => {
    actions.closeConversation();
    actions.closeDetails();
  }

  return (
    <SessionWrapper>
      { (state.display === 'xlarge') && (
        <div class="desktop-layout noselect">
          <div class="left">
            <Identity openAccount={openAccount} openCards={openCards} cardUpdated={state.cardUpdated} />
            <div class="bottom">
              <Channels open={openConversation} active={{
                  set: state.conversation,
                  card: state.cardId,
                  channel: state.channelId,
                }} />
            </div>
            { state.loading && (
              <div class="spinner">
                <Spin size="large" />
              </div>
            )}
          </div>
          <div class="center">
            <div class="reframe">
              <Welcome />
            </div>
            { state.conversation && (
              <div class="reframe">
                <Conversation closeConversation={actions.closeConversation}
                    openDetails={actions.openDetails}
                    cardId={state.cardId} channelId={state.channelId} />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact close={actions.closeContact} guid={state.contactGuid} listing={state.contactListing} />
              </div>
            )}
            { state.profile && (
              <div class="reframe">
                <Profile closeProfile={actions.closeProfile} />
              </div>
            )}
          </div>
          <div class="right">
            { (state.conversation || state.details) && (
              <div class="reframe">
                <Details closeDetails={actions.closeDetails} closeConversation={closeConversation} openContact={actions.openContact}
                    cardId={state.cardId} channelId={state.channelId} />
              </div>
            )}
            { state.cards && (
              <div class="reframe">
                <Cards closeCards={closeCards} openContact={actions.openContact} openListing={actions.openListing} />
                <Drawer bodyStyle={{ padding: 0 }} placement="bottom" closable={false} visible={state.listing}
                    onClose={actions.closeListing} getContainer={false} height={'100%'}
                    style={{ position: 'absolute', overflow: 'hidden' }}>
                  <Listing closeListing={actions.closeListing} openContact={actions.openContact} />
                </Drawer>
              </div>
            )}
            { (state.profile || state.account) && (
              <div class="reframe">
                <Account closeAccount={closeAccount} openProfile={actions.openProfile} />
              </div>
            )}
          </div>
        </div>
      )}
      { (state.display === 'large' || state.display === 'medium') && (
        <div class="tablet-layout noselect">
          <div class="left">
            <Identity openAccount={actions.openProfile} openCards={actions.openCards} cardUpdated={state.cardUpdated} />
            <div class="bottom">
              <Channels open={actions.openConversation} active={{
                  set: state.conversation,
                  card: state.cardId,
                  channel: state.channelId,
                }} />
            </div>
            { state.loading && (
              <div class="spinner">
                <Spin size="large" />
              </div>
            )}
          </div>
          <div class="right">
            <div class="reframe">
              <Welcome />
            </div>
            { state.conversation && (
              <div class="reframe">
                <Conversation closeConversation={actions.closeConversation}
                    openDetails={actions.openDetails}
                    cardId={state.cardId} channelId={state.channelId} />
              </div>
            )}
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={actions.closeDetails} visible={state.details} zIndex={10}>
              { state.details && (
                <Details closeDetails={actions.closeDetails} closeConversation={closeConversation} openContact={actions.openContact}
                    cardId={state.cardId} channelId={state.channelId} />
              )}
            </Drawer>
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={closeCards} visible={state.cards} zIndex={20} push={state.contact}>
              { state.cards && (
                <Cards closeCards={closeCards} openContact={actions.openContact} openListing={actions.openListing} />
              )}
              <Drawer bodyStyle={{ padding: 0 }} placement="bottom" closable={false} visible={state.listing}
                  onClose={actions.closeListing} getContainer={false} height={'100%'}
                  style={{ overflow: 'hidden', position: 'absolute' }}>
                <Listing closeListing={actions.closeListing} openContact={actions.openContact} />
              </Drawer>
              <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={actions.closeContact} visible={state.contact} zIndex={30}>
                { state.contact && (
                  <Contact close={actions.closeContact} guid={state.contactGuid} listing={state.contactListing} />
                )}
              </Drawer>
            </Drawer>
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={closeAccount} visible={state.profile || state.account} zIndex={40}>
              { (state.profile || state.account) && (
                <Profile closeProfile={closeAccount}/>
              )}
            </Drawer>
          </div>
        </div>
      )}
      { (state.display === 'small') && (
        <div class="mobile-layout noselect">
          <div class="top">
            <div class="reframe">
              <Channels open={actions.openConversation} active={{ 
                  set: state.conversation,
                  card: state.cardId,
                  channel: state.channelId,
                }} />
            </div>
            { state.conversation && (
              <div class="reframe">
                <Conversation closeConversation={actions.closeConversation} openDetails={actions.openDetails}
                    cardId={state.cardId} channelId={state.channelId} />
              </div>
            )}
            { state.details && (
              <div class="reframe">
                <Details closeDetails={actions.closeDetails} closeConversation={closeConversation} openContact={actions.openContact} 
                    cardId={state.cardId} channelId={state.channelId} />
              </div>
            )}
            { state.cards && (
              <div class="reframe">
                <Cards openContact={actions.openContact} openListing={actions.openListing} />
              </div>
            )}
            { state.listing && (
              <div class="reframe">
                <Listing closeListing={actions.closeListing} openContact={actions.openContact} />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact close={actions.closeContact} guid={state.contactGuid} listing={state.contactListing} />
              </div>
            )}
            { state.loading && (
              <div class="spinner">
                <Spin size="large" />
              </div>
            )}
            { (state.profile || state.account) && (
              <div class="reframe">
                <Profile />
              </div>
            )}
          </div>
          <div class="bottom">
            <BottomNav state={state} actions={actions} />
          </div>
        </div>
      )}
      <Modal centered visible={ringing.length > 0 && state.callStatus == null} footer={null} closable={false}> 
        <RingingWrapper>
          <div className="ringing-list">
            {ringing}
          </div>
        </RingingWrapper>
      </Modal>
      <Modal centered visible={state.callStatus} footer={null} closable={false} width={getWidth() + 12} height={getHeight() + 12} bodyStyle={{ paddingBottom: 0, paddingTop: 6, paddingLeft: 6, paddingRight: 6, paddingBottom: 6 }}>
        <CallingWrapper>
          { !state.remoteVideo && (
            <Logo url={state.callLogo} width={256} height={256} radius={8} />
          )}
          { state.remoteStream && (
            <video ref={remote} disablepictureinpicture playsInline autoPlay style={{ display: state.remoteVideo ? 'block' : 'none', width: '100%' }}
    complete={() => console.log("VIDEO COMPLETE")} progress={() => console.log("VIDEO PROGRESS")} error={() => console.log("VIDEO ERROR")} waiting={() => console.log("VIDEO WAITING")} />
          )}
          { state.localStream && (
            <div className="calling-local">
              <video ref={local} disablepictureinpicture playsInline autoPlay style={{ width: '100%', display: 'block' }}
    complete={() => console.log("VIDEO COMPLETE")} progress={() => console.log("VIDEO PROGRESS")} error={() => console.log("VIDEO ERROR")} waiting={() => console.log("VIDEO WAITING")} />
            </div>
          )}
          <div className="calling-options calling-hovered">
            { state.localVideo && (
              <div className="calling-option" onClick={actions.disableVideo}>
                <IoVideocamOutline />
              </div>
            )}
            { !state.localVideo && (
              <div className="calling-option" onClick={actions.enableVideo}>
                <IoVideocamOffOutline />
              </div>
            )}
            { state.localAudio && (
              <div className="calling-option" onClick={actions.disableAudio}>
                <IoMicOutline />
              </div>
            )}
            { !state.localAudio && (
              <div className="calling-option" onClick={actions.enableAudio}>
                <IoMicOffOutline />
              </div>
            )}
          </div>
          <div className="calling-end calling-hovered" onClick={actions.end}>
            <IoCallOutline />
          </div>
        </CallingWrapper>
      </Modal>
    </SessionWrapper>
  );
}

