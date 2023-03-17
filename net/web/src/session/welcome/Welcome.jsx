import { WelcomeWrapper } from './Welcome.styled';
import { RightOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';

import React, { createContext, useState, useRef, useEffect } from 'react';

import session from 'images/session.png';

export function Welcome() {

  const video = useRef();
  const vid = useRef();
  const peer = useRef();
  const ws = useRef();
  const candidates = useRef([]);

  const whiteNoise = () => {
    const canvas = Object.assign(document.createElement("canvas"), {width: 320, height: 240});
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 320, 240);
    const p = ctx.getImageData(0, 0, 320, 240);
    requestAnimationFrame(function draw(){
      for (var i = 0; i < p.data.length; i++) {
        p.data[i++] = p.data[i++] = p.data[i++] = Math.random() * 255;
      }
      ctx.putImageData(p, 0, 0);
      requestAnimationFrame(draw);
    });
    return canvas.captureStream();
  }

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    //const stream = await whiteNoise();
    peer.current.addTransceiver(stream.getTracks()[0], {streams: [stream]});
  };

  const rtc = async () => {
    const iceServers = [
    {
      urls: 'stun:192.168.13.233:5001?transport=udp', 
      username: 'user', 
      credential: 'pass'
    },
    {
      urls: 'turn:192.168.13.233:5001?transport=udp', 
      username: 'user', 
      credential: 'pass'
    }];

    const pc = new RTCPeerConnection({
     iceServers
    });

    //const pc = new RTCPeerConnection();
    peer.current = pc;

    pc.onicecandidate = (e) => {
      if (!e.candidate) return;

      ws.current.send(JSON.stringify({ candidate: e.candidate }));
      console.log(JSON.stringify(e.candidate));

      // If a srflx candidate was found, notify that the STUN server works!
      if(e.candidate.type == "srflx"){
          console.log("The STUN server is reachable!");
          console.log(`   Your Public IP Address is: ${e.candidate.address}`);
      }

      // If a relay candidate was found, notify that the TURN server works!
      if(e.candidate.type == "relay"){
          console.log("The TURN server is reachable !");
      }
    };

    pc.onicecandidateerror = (e) => {
      console.error(e);
    };

    pc.ontrack = ({streams: [stream]}) => {
      console.log("ON TRACK!");
      vid.current.srcObject = stream;
    };

    
    const dc = pc.createDataChannel("both", {negotiated: true, id: 0});

    pc.onnegotiationneeded = async () => {
      console.log("NEGOTIATION");
      create();
    };

  }

  const create = async () => {
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    ws.current.send(JSON.stringify({ offer: offer }));
    console.log(":: OFFER: ", offer);
  }

  useEffect(() => {
    rtc();
    ws.current = new WebSocket('wss://balzack.coredb.org/relay');
    ws.current.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.candidate) {
        console.log("> CANDIDATE: ", msg.candidate);
        candidates.current.push(msg.candidate);
        await peer.current.addIceCandidate(msg.candidate);
      }
      else if (msg.offer) {
        console.log("> OFFER: ", msg.offer);
        peer.current.setRemoteDescription(msg.offer);
        await peer.current.setLocalDescription(await peer.current.createAnswer());
        ws.current.send(JSON.stringify({ answer: peer.current.localDescription }));
      }
      else if (msg.answer) {
        console.log("> ANSWER: ", msg.answer);
        peer.current.setRemoteDescription(msg.answer);
      }
    }
    ws.current.onclose = (e) => {
      console.log("CLOSED");
    }
    ws.current.onopen = () => {
      console.log("OPENED");
    }
    ws.current.error = (e) => {
      console.log("ERROR");
    }

  }, []);

  return (
    <WelcomeWrapper>
      <div class="title">
        <div class="header">Databag</div>
        <div>Communication for the decentralized web</div>
      </div>

      <div style={{ width: 320, height: 240, backgroundColor: 'white' }}>
        <video ref={vid} width={320} height={240} autoPlay
          complete={() => console.log("VIDEO COMPLETE")} progress={() => console.log("VIDEO PROGRESS")} error={() => console.log("VIDEO ERROR")} waiting={() => console.log("VIDEO WAITING")} />
      </div>

      <div style={{ width: 100, height: 32}} onClick={create}>Create</div>
      <div style={{ width: 100, height: 32}} onClick={start}>Start</div>

      <div class="message">
        <Space>
          <div>Setup your profile</div>
          <RightOutlined />
          <div>Connect with people</div>
          <RightOutlined />
          <div>Start a conversation</div>
        </Space>
      </div>
    </WelcomeWrapper>
  );
}

