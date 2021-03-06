import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';
import ConnectyCube from 'react-native-connectycube';
import InCallManager from 'react-native-incall-manager';
import Sound from 'react-native-sound';
import { users } from '../config';

export default class CallService {
  static MEDIA_OPTIONS = { audio: true, video: { facingMode: 'user' } };

  static _session = null;
  mediaDevices = [];

  outgoingCall = new Sound(require('../../../assets/sounds/dialing.mp3'));
  incomingCall = new Sound(require('../../../assets/sounds/calling.mp3'));
  endCall = new Sound(require('../../../assets/sounds/end_call.mp3'));

  showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  getUserById = (userId, key) => {
    const user = users.find(user => user.id == userId);
    console.log('================>>>>>>>>>', userId, key)
    if (typeof key === 'string') {
     // return user[key];
    }

    return "";
  };

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then(mediaDevices => {
      this.mediaDevices = mediaDevices;
    });
  }

  acceptCall = session => {
    this.stopSounds();
    this._session = session;
    this.setMediaDevices();

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then(stream => {
        this._session.accept({});
        return stream;
      });
  };

  startCall = ids => {
    const options = {};
    const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible

    this._session = ConnectyCube.videochat.createNewSession(ids, type, options);
    this.setMediaDevices();
    this.playSound('outgoing');
    console.log('---------------------->>>', this._session)
    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then(stream => {
        this._session.call({});
        return stream;
      });
  }; 

  stopCall = () => {
    this.stopSounds();

    if (this._session) {
      this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
  };

  rejectCall = (session, extension) => {
    this.stopSounds();
    session.reject(extension);
  };

  setAudioMuteState = mute => {
    if (mute) {
      this._session.mute('audio');
    } else {
      this._session.unmute('audio');
    }
  };

  setMuteVideoState = mute => {
    if(mute){
      this._session.mute('video');
    }else{
      this._session.mute('video');
    }
  }

  switchCamera = localStream => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  setSpeakerphoneOn = flag => InCallManager.setSpeakerphoneOn(flag);

  processOnUserNotAnswerListener(userId) {
    return new Promise((resolve, reject) => {
      console.log('this._session this._session======>>>', this._session)
      if (!this._session) {
        reject();
      } else {
        console.log('userId +++++++++++++++++++++ userId', userId)
        //const userName = this.getUserById(userId, 'name');
        const message = `Aucune reponse !`;

        this.showToast(message);

        resolve();
      }
    });
  }

  processOnCallListener(session) {
    return new Promise((resolve, reject) => {
      if (session.initiatorID === session.currentUserID) {
        reject();
      }

      if (this._session) {
        this.rejectCall(session, { busy: true });
        reject();
      }

      this.playSound('incoming');

      resolve();
    });
  }

  processOnAcceptCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        this.showToast('You have accepted the call on other side');

        reject();
      } else {
        //const userName = this.getUserById(userId, 'name');
        const message = `Appel d??crocher !`;

        this.showToast(message);
        this.stopSounds();

        resolve();
      }
    });
  }

  processOnRejectCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        this.showToast('You have rejected the call on other side');

        reject();
      } else {
        //const userName = this.getUserById(userId, 'name');
        const message = extension.busy
          ? `Para??t'il qu'il est occup??`
          : `L'appel a ??t?? r??jeter`;

        this.showToast(message);

        resolve();
      }
    });
  }

  processOnStopCallListener(userId, isInitiator) {
    return new Promise((resolve, reject) => {
      this.stopSounds();

      if (!this._session) {
        reject();
      } else {
        //const userName = this.getUserById(userId, 'name');
        const message = `L'appel a ??t?? ${
          isInitiator ? 'arr??t??' : 'mise a atente'
          }`;

        this.showToast(message);

        resolve();
      }
    });
  }

  processOnRemoteStreamListener = () => {
    return new Promise((resolve, reject) => {
      console.log('""""""""""""""""""""""""""""""""""""""""""""""""', this._session)
      if (!this._session) {
        reject();
      } else {
        resolve();
      }
    });
  };

  playSound = type => {
    switch (type) {
      case 'outgoing':
        this.outgoingCall.setNumberOfLoops(-1);
        this.outgoingCall.play();
        break;
      case 'incoming':
        this.incomingCall.setNumberOfLoops(-1);
        this.incomingCall.play();
        break;
      case 'end':
        this.endCall.play();
        break;

      default:
        break;
    }
  };

  stopSounds = () => {
    if (this.incomingCall.isPlaying()) {
      this.incomingCall.pause();
    }
    if (this.outgoingCall.isPlaying()) {
      this.outgoingCall.pause();
    }
  };
}