import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import { connect } from 'react-redux'
import RTCViewGrid from './RTCViewGrid';
import {CallService, AuthService, x} from '../../services';
import ToolBar from './ToolBar';
import UsersSelect from './UsersSelect';


class VideoScreen extends React.Component {
  constructor(props) {
    super(props);

    this._session = null;
    this.opponentsIds = [props.route?.params?.callId];

    this.state = {
      localStream: null, 
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
      isIncomingCall: false,
    };
    //this._setUpListeners();
    
  }

  // _onCallListener = (session, extension) => {
  //     CallService.processOnCallListener(session)
  //       .then(() => this.showInomingCallModal(session))
  //       .catch(this.hideInomingCallModal);
  // };

  componentWillUnmount() {
    CallService.stopCall();
    //AuthService.logout();
  }

  componentDidUpdate(prevProps, prevState) {
    const currState = this.state;

    if (
      prevState.remoteStreams.length === 1 &&
      currState.remoteStreams.length === 0
    ) {
      CallService.stopCall();
      this.resetState();
    }
  } 

  // showInomingCallModal = session => {
  //   this._session = session;
  //   this.setState({isIncomingCall: true});
  // }; 

  hideInomingCallModal = () => {
      this._session = null;
      let ob = {isIncomingCall: false}
      this.setState({hideModal: true})
      this.props.setKey(ob)
  };

  selectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: [...prevState.selectedUsersIds, userId],
    }));
  };

  unselectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: prevState.selectedUsersIds.filter(id => userId !== id),
    }));
  };

  closeSelect = () => {
    this.setState({isActiveSelect: false});
  };

  setOnCall = () => {
    this.setState({isActiveCall: true});
  };

  initRemoteStreams = opponentsIds => {
    const emptyStreams = opponentsIds.map(userId => ({
      userId,
      stream: null,
    }));
    let ob = {remoteStreams: emptyStreams}
    this.props.setKey(ob)
    //this.setState({remoteStreams: emptyStreams});
  };

  updateRemoteStream = (userId, stream) => {
    this.setState(({remoteStreams}) => {
      const updatedRemoteStreams = remoteStreams.map(item => {
        if (item.userId === userId) {
          return {userId, stream};
        }

        return {userId: item.userId, stream: item.stream};
      });

      return {remoteStreams: updatedRemoteStreams};
    });
  };

  removeRemoteStream = userId => {
    this.setState(({remoteStreams}) => ({
      remoteStreams: remoteStreams.filter(item => item.userId !== userId),
    }));
  };

  setLocalStream = stream => {
    this.setState({localStream: stream});
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


  _onPressAccept = () => {
    CallService.acceptCall(this.props._session).then(stream => {
      const {opponentsIDs, initiatorID, currentUserID} = this.props._session;
      const opponentsIds = [initiatorID, ...opponentsIDs].filter(
        userId => currentUserID !== userId,
      );
      console.log('opp??????????????????', opponentsIds)
      this.initRemoteStreams(opponentsIds);
      this.setLocalStream(stream);
      this.closeSelect();
      this.hideInomingCallModal();
    }); 
  };

  _onPressReject = () => {
    CallService.rejectCall(this.props._session);
    this.hideInomingCallModal();
  };

  

  // _onAcceptCallListener = (session, userId, extension) => {
  //   CallService.processOnAcceptCallListener(session, userId, extension)
  //     .then(this.setOnCall)
  //     .catch(this.hideInomingCallModal);
  // };

  // _onRejectCallListener = (session, userId, extension) => {
  //   CallService.processOnRejectCallListener(session, userId, extension)
  //     .then(() => this.removeRemoteStream(userId))
  //     .catch(this.hideInomingCallModal);
  // };

  // _onStopCallListener = (session, userId, extension) => {
  //   const isStoppedByInitiator = session.initiatorID === userId;

  //   CallService.processOnStopCallListener(userId, isStoppedByInitiator)
  //     .then(() => {
  //       if (isStoppedByInitiator) {
  //         this.resetState();
  //       } else {
  //         this.removeRemoteStream(userId);
  //       }
  //     })
  //     .catch(this.hideInomingCallModal);
  // };

  // _onUserNotAnswerListener = (session, userId) => {
  //   CallService.processOnUserNotAnswerListener(userId)
  //     .then(() => this.removeRemoteStream(userId))
  //     .catch(this.hideInomingCallModal);
  // };

  // _onRemoteStreamListener = (session, userId, stream) => {
  //   CallService.processOnRemoteStreamListener(userId)
  //     .then(() => {
  //       this.updateRemoteStream(userId, stream);
  //       this.setOnCall();
  //     })
  //     .catch(this.hideInomingCallModal);
  // };

  render() {
    const {
      localStream,
      selectedUsersIds,
      isActiveSelect,
    } = this.state;
      const {isIncomingCall, remoteStreams, isActiveCall} = this.props

      console.log('######################################')
      console.log(this.props.isIncomingCall)
      console.log('######################################')
    const initiatorName = isIncomingCall
      ? CallService.getUserById(this.props._session.initiatorID, 'name')
      : '';
    const localStreamItem = localStream
      ? [{userId: 'localStream', stream: localStream}]
      : [];
    const streams = [...remoteStreams, ...localStreamItem];

    CallService.setSpeakerphoneOn(remoteStreams.length > 0);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <RTCViewGrid streams={streams} />
        {/*
          <UsersSelect
          isActiveSelect={isActiveSelect}
          opponentsIds={this.opponentsIds}
          selectedUsersIds={selectedUsersIds}
          selectUser={this.selectUser}
          unselectUser={this.unselectUser}
        />
        */} 
        <ToolBar 
          selectedUsersIds={selectedUsersIds} 
          localStream={localStream}
          noStarcall={this.props.route.params?.noStarcall}
          isActiveSelect={isActiveSelect}
          isActiveCall={this.props.isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
          navigation={this.props.navigation}
          callId={this.props.route.params?.callId}
          is_doctor={this.props.route.params?.is_doctor}

        />
        <AwesomeAlert
          show={isIncomingCall}
          showProgress={false}
          title={`Appel entrant ${initiatorName}`}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Rejeter"
          confirmText="Accepter"
          cancelButtonColor="red"
          confirmButtonColor="green"
          onCancelPressed={this._onPressReject}
          onConfirmPressed={this._onPressAccept}
          onDismiss={this.hideInomingCallModal}
          alertContainerStyle={{zIndex: 1}}
          titleStyle={{fontSize: 21}}
          cancelButtonTextStyle={{fontSize: 18}}
          confirmButtonTextStyle={{fontSize: 18}}
        />
      </SafeAreaView>
    );
  }
}


const mapStateToProps = (state) => { 
  console.log('_________________________________>>>', state)
  return state
}
const mapDispatchToProps = dispatch => {
  return {
    setKey: async (ob) => {
      dispatch({type: "UPDATE", data: ob});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen);
