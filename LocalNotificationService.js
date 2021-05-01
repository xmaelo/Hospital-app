import PushNotification from 'react-native-push-notification';

//fcm_fallback_notification_channel

PushNotification.createChannel(
    {
      channelId: "fcm_fallback_notification_channel", // (required)
      channelName: "fcm_fallback_notification_channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

class LocalNotificationService {
  configure = onOpenNotification => { 
    PushNotification.configure({
      onRegister: function(token) {
        console.log('[LocalNotificationService] onRegister: ', token);
      },
      onNotification: function(notification) {
        console.log( 
          '[LocalNotificationService] onNotification: ',
          notification,
        );
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(notification.data);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,

      requestPermissions: true,
    }); 
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    console.log("========================================", title, message)
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      title: data.title || '',
      message: data.body || '',
      playSound: options.playSound || true,
      soundName: options.soundName || 'default',
      userInteraction: true
    });
  };
 
  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      chanel_id: "fcm_fallback_notification_channel",
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher_round',
      smallIcon: options.smallIcon || 'ic_launcher_transparent',
      bigText: data.title || '',
      sebText: data.body || '',
      vibrate: options.vibrate || true,
      priority: options.priority | 'hight',
      importance: options.importance || 'hight',
      data: data,
    };
  };

  cancleAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = notificationId => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID: ',
      notificationId,
    );
    PushNotification.cancelAllLocalNotifications({id: `${notificationId}`});
  };
}

export const localNotificationService = new LocalNotificationService();