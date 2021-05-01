import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {CallService} from '../../services';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import ConnectyCube from 'react-native-connectycube';

export default class ToolBar extends Component {
  state = {
    isAudioMuted: false,
    isFrontCamera: true,
    isVideoMuted: false,
  };

  componentDidMount(){ 
    if(!this.props.noStarcall){
      //this.startCall();
    }
  }
  static getDerivedStateFromProps(props, state) {
    let derivedState = {};

    if (!props.isActiveCall) {
      derivedState.isAudioMuted = false;
      derivedState.isVideoMuted = false;
      derivedState.isFrontCamera = true;
    }

    return derivedState;
  }

  startCall = (callable) => {
    callable  = [this.props.callId]
    const {
      selectedUsersIds,
      closeSelect,
      initRemoteStreams,
      setLocalStream, 
    } = this.props;

     if (!callable || callable?.length==0) {
        CallService.showToast('Vous devez etre suivi par un medecin !');
        this.props.navigation.push("Main");
      } else { 
        closeSelect();
        initRemoteStreams([callable]);
        CallService.startCall([callable]).then(setLocalStream);
      }

  };

  stopCall = () => {
    const {resetState} = this.props;

    CallService.stopCall();
    resetState();
    if(!this.props.is_doctor){
      this.props.navigation.push("Main");
    }else{
      this.props.navigation.push("TabBarMed");
    }
  };

  switchCamera = () => {
    const {localStream} = this.props;

    CallService.switchCamera(localStream);
    this.setState(prevState => ({isFrontCamera: !prevState.isFrontCamera}));
  };

  muteUnmuteAudio = () => {
    this.setState(prevState => {
      const mute = !prevState.isAudioMuted;
      CallService.setAudioMuteState(mute);
      return {isAudioMuted: mute};
    });
  };
  muteUnmuteVideo = () => {
    this.setState(prevState => {
      const mute = !prevState.isVideoMuted;
      CallService.setMuteVideoState(mute);
      return {isVideoMuted: mute};
    });
  };

  _renderCallStartStopButton = isCallInProgress => {
    const style = isCallInProgress ? styles.buttonCallEnd : styles.buttonCall;
    const onPress = isCallInProgress ? this.stopCall : this.startCall;
    const type = isCallInProgress ? 'call-end' : 'call';

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, style]}
        onPress={onPress}>
        <MaterialIcon name={type} size={32} color="white" />
      </TouchableOpacity>
    );
  };

  _renderMuteButton = () => {
    const {isAudioMuted} = this.state;
    const type = isAudioMuted ? 'mic-off' : 'mic';

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonMute]}
        onPress={this.muteUnmuteAudio}>
        <MaterialIcon name={type} size={32} color="white" />
      </TouchableOpacity>
    );
  };
_renderMuteVideoButton = () => {
    const {isVideoMuted} = this.state;
    const type = isVideoMuted ? 'videocam-off' : 'videocam';

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonMute]}
        onPress={this.muteUnmuteVideo}>
        <MaterialIcon name={type} size={32} color="white" />
      </TouchableOpacity>
    );
  };

  _renderSwitchVideoSourceButton = () => {
    const {isFrontCamera} = this.state;
    const type = isFrontCamera ? 'camera-rear' : 'camera-front';

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonSwitch]}
        onPress={this.switchCamera}>
        <MaterialIcon name={type} size={32} color="white" />
      </TouchableOpacity>
    );
  };

  render() {
    const {isActiveSelect, isActiveCall} = this.props;
    const isCallInProgress = isActiveCall || !isActiveSelect;
    const isAvailableToSwitch =
      isActiveCall && CallService.mediaDevices.length > 1;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.toolBarItem}>
          {isActiveCall && this._renderMuteButton()}
        </View>
        {isActiveCall &&
          <View style={styles.toolBarItem}>
            {isActiveCall && this._renderMuteVideoButton()}
          </View>
        }
        <View style={styles.toolBarItem}>
          {this._renderCallStartStopButton(isCallInProgress)}
        </View>
        <View style={styles.toolBarItem}>
          {isAvailableToSwitch && this._renderSwitchVideoSourceButton()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 60,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 100,
  },
  toolBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCall: {
    backgroundColor: 'green',
  },
  buttonCallEnd: {
    backgroundColor: 'red',
  },
  buttonMute: {
    backgroundColor: 'blue',
  },
  buttonSwitch: {
    backgroundColor: 'orange',
  },
});