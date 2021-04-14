import React from 'react';
import ConnectyCube from 'react-native-connectycube';
import { connect } from 'react-redux'
import {CallService, AuthService, x} from './services';

class Init extends React.Component{
	constructor(props) {
	    super(props);
	    this.start();
	    this.state={
	    	localStream: null,
	      remoteStreams: [],
	      selectedUsersIds: [],
	      isActiveSelect: true,
	      isActiveCall: false,
	      isIncomingCall: false,
	    }
	}
	start = (props) => {
	    this._setUpListeners();
	    
    }

    _setUpListeners() {
	    ConnectyCube.videochat.onCallListener = this._onCallListener;
	    ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
	    ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
	    ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
	    ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
	    ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener; 
	}
    showInomingCallModal = _session => {
    	let ob = {_session: _session, isIncomingCall: true}
	    this.props.setKey(ob)
	    let opponentsIds = [];
	    let is_doctor = this.props.is_doctor;
	    this.props.navigation.push('VideoScreen', {opponentsIds, noStarcall: true, is_doctor: is_doctor})
	  };
	hideInomingCallModal = () => {
	    let ob = {isIncomingCall: false}
	    this.props.setKey(ob)
	    //this.setState({isIncomingCall: false});
	};
    _onCallListener = (_session, extension) => {
      CallService.processOnCallListener(_session)
        .then(() => this.showInomingCallModal(_session))
        .catch(this.hideInomingCallModal);
    };

    setOnCall = () => {
    	let ob = {isActiveCall: true}
    	this.props.setKey(ob)
  	};

     _onAcceptCallListener = (_session, userId, extension) => {
	    CallService.processOnAcceptCallListener(_session, userId, extension)
	      .then(this.setOnCall)
	      .catch(this.hideInomingCallModal);
	  };


	 removeRemoteStream = userId => {
	 	this.setState({remoteStreams: this.props.remoteStreams})
	   this.setSate(({remoteStreams}) => ({
	      remoteStreams: this.props.remoteStreams.filter(item => item.userId !== userId),
	    }));
	    this.props.setKey({...this.state});
	  };


    _onRejectCallListener = (_session, userId, extension) => {
	    CallService.processOnRejectCallListener(_session, userId, extension)
	      .then(() => this.removeRemoteStream(userId))
	      .catch(this.hideInomingCallModal);
	  };

	resetState = () => {
		let ob = {
	      localStream: null,
	      remoteStreams: [],
	      selectedUsersIds: [],
	      isActiveSelect: true,
	      isActiveCall: false,
	    }
	    this.props.setKey(ob)
	};

    _onStopCallListener = (_session, userId, extension) => {
	    const isStoppedByInitiator = _session.initiatorID === userId;

	    CallService.processOnStopCallListener(userId, isStoppedByInitiator)
	      .then(() => {
	        if (isStoppedByInitiator) {
	          this.resetState();
	        } else {
	          this.removeRemoteStream(userId);
	        }
	      })
	      .catch(this.hideInomingCallModal);
	  };

    _onUserNotAnswerListener = (_session, userId) => {
	    CallService.processOnUserNotAnswerListener(userId)
	      .then(() => this.removeRemoteStream(userId))
	      .catch(this.hideInomingCallModal);
	  };

	 updateRemoteStream = (userId, stream) => {
	 	this.setState({remoteStreams: this.props.remoteStreams});

	    this.setState(({remoteStreams}) => {
	      const updatedRemoteStreams = this.props.remoteStreams.map(item => {
	        if (item.userId === userId) {
	          return {userId, stream};
	        }

	        return {userId: item.userId, stream: item.stream};
	      });

	      return {remoteStreams: updatedRemoteStreams};
	    });
	    this.props.setKey({...this.state})
	  };


    _onRemoteStreamListener = (_session, userId, stream) => {
	    CallService.processOnRemoteStreamListener(userId)
	      .then(() => {
	        this.updateRemoteStream(userId, stream);
	        this.setOnCall();
	      })
	      .catch(this.hideInomingCallModal);
	 };

	 render(){
	 	return<></>
	 }
}



const mapStateToProps = (state) => { 
  return state
}
const mapDispatchToProps = dispatch => {
  return {
    setKey: async (ob) => {
      dispatch({type: "UPDATE", data: ob});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Init);