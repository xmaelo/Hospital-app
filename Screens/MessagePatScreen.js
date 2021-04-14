import React, { useState, useEffect } from 'react';
import {
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
} from 'react-native';
import { Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';



export default function MessagePatScreen({navigation}){
	const [inputMessage, setInputMessage] = useState('');

	const [chatUser, setDoc] = useState({});
	const [docId, setDocId] = useState(null);

	  const [currentUser, setUsers] = useState({});
 
	  const [messages, setMessages] = useState([]);

	  function sendMessage() {
	  	try{
		    if (inputMessage === '') {
		      return setInputMessage('');
		    }
		    let message = {
		    	senderId: auth().currentUser.uid,
		        message: inputMessage,
		        userId: auth().currentUser.uid,
		        docId: docId,
		        time: new Date().toISOString(),
		        createdAt: new Date().getTime()
		    };
		    let chats = database().ref('messages/'+currentUser.docId+"/"+auth().currentUser.uid);
			chats.push(message)
		    setInputMessage('');
		}catch(e){
			console.log('errrrr=====>', e)
		}
	  }

	  useEffect(() => { 
		    (async()  =>{
		      	let user = database().ref('users/'+auth().currentUser.uid);

		      	user.on('value', (snapshot) => {
					setUsers(snapshot.val());
					if(!snapshot.val().docId){
						console.log('--------------------------')
						let mess = [{
							senderId: null,
					        message: "Vous devez etre suivi par un medecin pour utiliser ce chat !",
					        userId: null,
					        docId: 'docId',
					        time: new Date().toISOString(),
					        createdAt: new Date().getTime()
						}]
						setMessages(mess)

					}else{
						let chats = database().ref('messages/'+snapshot.val().docId+"/"+auth().currentUser.uid).orderByChild('createdAt', 'desc');
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

						let doc = database().ref('users/'+snapshot.val().docId);

				      	doc.once('value', (snapshot) => {
							setDoc(snapshot.val());
						});
					}
				}); 
		      	
		    })();
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
		                      item.senderId === auth().currentUser.uid
		                        ? 'flex-end'
		                        : 'flex-start',
		                    marginHorizontal: 10,
		                    padding: 10,
		                    borderRadius: 8,
		                    borderBottomLeftRadius:
		                      item.senderId === auth().currentUser.uid ? 8 : 0,
		                    borderBottomRightRadius:
		                      item.senderId === auth().currentUser.uid ? 0 : 8,
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
		                  {item.senderId &&
			                  <Text
			                    style={{
			                      color: '#dfe4ea',
			                      fontSize: 14,
			                      alignSelf: 'flex-end',
			                    }}
			                  >
			                    {item.time}
			                  </Text>
			               }
		                </View>
		              </View>
		            </TouchableWithoutFeedback>
		          )}
		        />
		        <View style={{ paddingVertical: 10 }}>
		          <View style={styles.messageInputView}>
		            <TextInput
		              defaultValue={inputMessage}
		              style={styles.messageInput}
		              editable={!!currentUser.docId}
		              placeholder='Message'
		              onChangeText={(text) => setInputMessage(text)}
		              onSubmitEditing={() => {
		                sendMessage();
		              }}
		            />
		            <TouchableOpacity
		              style={styles.messageSendView}
		              onPress={() => {
		                sendMessage();
		              }}
		            >
		              <Icon name='send' type='material' />
		            </TouchableOpacity>
		          </View>
		        </View>
          </View>
        </TouchableWithoutFeedback>
	)
}


const styles = StyleSheet.create({
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