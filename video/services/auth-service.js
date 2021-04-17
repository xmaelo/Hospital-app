import ConnectyCube from 'react-native-connectycube';
import database from '@react-native-firebase/database';
import config from '../config';

export default class AuthService{
  init = () => ConnectyCube.init(...config);

  login = user => {
    return new Promise((resolve, reject) => {
      if(user.email && user.email.length < 8){
        user = {...user, password: user.email+"_"+user.email}
      }
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
      console.log('connect start here===>>>')
      ConnectyCube.createSession().then((session) => {
        if(user.email && user.email.length < 8){
          user = {...user, password: user.email+"_"+user.email}
        }
        console.log('session###################"""', session)
        ConnectyCube.users.signup(user).then((user1) => {
            console.log('user1 #######################"', user1)
            ConnectyCube.login(user).then(()=>{
              let users = database().ref('users/'+idU)
              users.update({callId: user1.user.id})
              ConnectyCube.chat.connect({
                userId: user1.user.id,
                password: user.password,
              })
            }).catch(()=>{});
          })
          .catch((error) => {console.log('error created', error)});
      }).catch((error) => {console.log('error ======================>>>', error)});

    }
    console.log('user.id=======>>', user.id)

    if(user.id){
      this.login({...user}).then(()=>{}).catch(()=>{});
    }else{
      connect();
    }
    
  };
}
