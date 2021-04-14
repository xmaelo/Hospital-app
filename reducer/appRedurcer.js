

initialState = {
	localStream: null, 
    remoteStreams: [],
    selectedUsersIds: [],
    isActiveSelect: true,
    isActiveCall: false,
    isIncomingCall: false,
}

function app(state = initialState, action) {
	let curentState = state;
  	switch (action.type) {
	  	case 'UPDATE':
	  	    console.log('___________UPDATE_____________________', action.data)
	  		curentState = {...curentState, ...action.data}
	      	return curentState;
	  
	  	default:
    		return curentState;
  }
}
export default app;