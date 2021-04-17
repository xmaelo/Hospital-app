import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image, 
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Icon } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AttachmentIcon from 'react-native-vector-icons/Entypo'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

export default function ChatScreen({navigation, route}){
	const [chatUser, setUsers] = useState({});

	  const [currentUser, setCurrentUser] = useState({}); 

	  const [messages, setMessages] = useState([]);

	  const [inputMessage, setInputMessage] = useState('');
	  const docId = auth().currentUser.uid;

	  function sendMessage() {
	  	try{
		    if (inputMessage === '') {
		      return setInputMessage('');
		    }
		    let message = {
		    	senderId: docId,
		        message: inputMessage,
		        userId: route.params.userId,
		        docId: docId,
		        receiverId: route.params.userId,
		        time: new Date().toISOString(),
		        createdAt: new Date().getTime()
		    }; 
			let chats = database().ref('messages/'+docId+"/"+route.params.userId);
			chats.push(message)
		    setInputMessage('');
		}catch(e){
			console.log('errrrr=====>', e)
		}
	  } 

	  const optionNavigator = (chatUser) =>{
	  		console.log('navigation set optionNavigator',chatUser.nom_complet)
	   		navigation.setOptions({
		      title: "",
		      headerLeft: () => (
		        <View style={styles.headerLeft}>
		          <TouchableOpacity
		            style={{ paddingRight: 10 }}
		            onPress={() => {
		              navigation.goBack();
		            }}
		          >
		            <Icon
		              name='angle-left'
		              type='font-awesome'
		              size={30}
		              color='black'
		            />
		          </TouchableOpacity>
		          <Image
		            style={{...styles.userProfileImage, marginLeft: 10}}
		            source={{ uri: chatUser.profile }}
		          />
		          <View
		            style={{
		              paddingLeft: 10,
		              justifyContent: 'center',
		            }}
		          >
		            <Text style={{ color: 'black', fontWeight: '700', fontSize: 18 }}>
		              {chatUser.nom_complet}
		            </Text>
		            <Text style={{ color: 'black', fontWeight: '300' }}>
		              {chatUser.last_seen}
		            </Text>
		          </View>
		        </View>
		      ),
		      headerRight: () => (
		        <TouchableOpacity
		          style={{ paddingRight: 10 }}
		          onPress={() => {
		            Alert.alert('Audio Call', 'Audio Call Button Pressed');
		          }}
		        >
		          <Icon name='call' size={28} color='black' />
		        </TouchableOpacity>
		      ),
		    });
	   }


	  	useEffect(() => { 
		    (async()  =>{
		    	const docId = auth().currentUser.uid;

		      	let user = database().ref('users/'+route.params.userId);

		      	user.on('value', (snapshot) => {
		      		console.log('value value=====>', snapshot.val())
					setUsers(snapshot.val());
					optionNavigator(snapshot.val());
				}); 

				let user2 = database().ref('users/'+docId);
				user2.update({
					last_seen: 'online'
				})

		      	user2.once('value', (snapshot) => {
		      		console.log('value value=====>', snapshot.val())
					setCurrentUser(snapshot.val());
				});
		      	

				  let chats = database().ref('messages/'+docId+"/"+route.params.userId).orderByChild('createdAt');
				    chats.on('value', (snapshot) => {
				      	if(snapshot.val()){
					      	let mes = Object.values(snapshot.val()).map((value, key)=>{
					      		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
								let d  = new Date(value.time);
								let firs = "";
								if(d.getDate() === new Date().getDate()){
									firs = null
								}else{
									firs = d.toLocaleDateString("en-US", options)
								}
								let xc = (firs?(firs+ " à "): null)+d.getHours() + ":" + d.getMinutes()
						    	return {...value, time: xc}
					      	})
							setMessages(mes.sort((a, b)=>b.createdAt - a.createdAt));
						}
					});
		    })();
		    return () => {
		    	let user2 = database().ref('users/'+docId);
			    user2.update({
					last_seen: new Date().getTime()
				})
				console.log('è___________returns')
			  }
		  }, []);

	   


	return(
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
         <View style={styles.container}>
		        <FlatList
		          style={{ backgroundColor: '#f2f2ff' }}
		          inverted={true}
		          data={JSON.parse(JSON.stringify(messages))}
		          renderItem={({ item }) => (
		            <TouchableWithoutFeedback>
		              <View style={{ marginTop: 6 }}>
		                <View
		                  style={{
		                    maxWidth: Dimensions.get('screen').width * 0.8,
		                    backgroundColor: '#3a6ee8',
		                    alignSelf:
		                      item.senderId === chatUser.docId
		                        ? 'flex-end'
		                        : 'flex-start',
		                    marginHorizontal: 10,
		                    padding: 10,
		                    borderRadius: 8,
		                    borderBottomLeftRadius:
		                      item.senderId === chatUser.docId ? 8 : 0,
		                    borderBottomRightRadius:
		                      item.senderId === chatUser.docId ? 0 : 8,
		                  }}
		                >
		                  <Text
		                    style={{
		                      color: '#fff',
		                      fontSize: 16,
		                    }}
		                  >
		                    {item.message}
		                  </Text>
		                  <Text
		                    style={{
		                      color: '#dfe4ea',
		                      fontSize: 14,
		                      alignSelf: 'flex-end',
		                    }}
		                  > 
		                    {item.time}
		                  </Text>
		                </View>
		              </View>
		            </TouchableWithoutFeedback>
		          )}
		        />
		        <View style={styles.container1}>
		          <View style={styles.inputContainer}>
		            <AutoGrowingTextInput
		              style={styles.textInput}
		              placeholder="Votre message..."
		              placeholderTextColor="grey"
		              value={inputMessage}
		              onChangeText={(text) => setInputMessage(text)}
		              maxHeight={170}
		              minHeight={50}
		              enableScrollToCaret
		            />
		            <TouchableOpacity style={styles.attachment}>
		              <AttachmentIcon name="attachment" size={22} color="#8c8c8c" onPress={()=>{}} />
		            </TouchableOpacity>
		          </View>
		          <TouchableOpacity style={styles.button}>
		            <Icon name="send" size={32} color="blue" onPress={() => sendMessage()} />
		          </TouchableOpacity>
		        </View>
          </View>
        </TouchableWithoutFeedback>
	)
}


const styles = StyleSheet.create({
 	container1: {
	    flexDirection: 'row',
	    alignItems: 'flex-end',
	    justifyContent: 'center',
	    borderTopWidth: 1,
	    borderTopColor: 'lightgrey',
	    paddingVertical: 12,
	    paddingHorizontal: 35
	  },
	  textInput: {
	    flex: 1,
	    fontSize: 18,
	    fontWeight: '300',
	    color: '#8c8c8c',
	    borderRadius: 25,
	    paddingHorizontal: 12,
	    paddingTop: Platform.OS === 'ios' ? 14 : 10,
	    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
	    paddingRight: 35,
	    backgroundColor: 'whitesmoke',
	  },
	  button: {
	    width: 40,
	    height: 50,
	    marginBottom: Platform.OS === 'ios' ? 15 : 0,
	    marginLeft: 12,
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
	  attachment: {
	    width: 40,
	    height: 50,
	    position: 'absolute',
	    right: 5,
	    bottom: 0,
	    marginLeft: 12,
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
	  inputContainer: {
	    marginBottom: Platform.OS === 'ios' ? 15 : 0,
	    flexDirection: 'row'
	  },
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: { height: '100%', aspectRatio: 1, borderRadius: 100 },
  container: {
    flex: 1,
    backgroundColor: '#f2f2ff',
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});