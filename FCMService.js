import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          this.getToken(onRegister);
        } else {
          // user doens't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('===========>token', fcmToken)
          onRegister(fcmToken);
          messaging().subscribeToTopic('all');
        } else {
          console.log('[FCMService] user does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] request permission rejected ', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] deleteToken ');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] delete token error ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // when the app is running, but in the backgroud
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('app tourne__________________________________ en background');
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    // when the app is opened from a quit state.
    messaging().getInitialNotification().then(remoteMessage => {
        console.log('une autre _____________________________nottif entrante');
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
          // this.removeDeliveredNotification(notification.notificationId)
        }
      });

    // foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('#################========<<<<<<<<', remoteMessage);
      if (remoteMessage) {
          let notification = remoteMessage.notification;
          if(!notification.body){
            notification = {...notification, body: remoteMessage.body}
          }
          if(!notification.title){
            notification = {...notification, title: remoteMessage.title}
          }
        onNotification(notification);
      }
    });
 
    // triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      console.log('[FCMService] new token refresg: ', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    //this.messageListener();
  };
}

export const fcmService = new FCMService();
