import ConnectyCube from 'react-native-connectycube';
import database from '@react-native-firebase/database';
import config from '../config';

export default class AuthService{
  init = () => ConnectyCube.init(...config);

  login = user => {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(user)
        .then(() =>
          ConnectyCube.chat.connect({
            userId: user.id,
            password: user.password,
          }),
        )
        .then(resolve)
        .catch(reject);
    });
  };


  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
  };

  check = (user) => { 
    let idU = user.idU
    const _onSuccessLogin = () => {
    };

    const _onFailLogin = (error = {}) => {
      console.log('____eroor auth_____', error)
      alert(`Error.\n\n${JSON.stringify(error)}`);
    };

    const connect = () => {
      ConnectyCube.users.signup(user).then((user1) => {
          this.login({...user}).then(()=>{}).catch(()=>{});
          let users = database().ref('users/'+idU)
          users.update({callId: user1.user.id})
        })
        .catch((error) => {console.log('error created', error)});
    }

    if(user.idU){
      this.login({...user}).then(()=>{}).catch(()=>{});
    }else{
      connect();
    }
    
  };
}
