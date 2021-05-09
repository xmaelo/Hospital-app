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
  KeyboardAvoidingView,
} from 'react-native';
import AttachmentIcon from 'react-native-vector-icons/Entypo'
import { Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';


const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height
const _keyExtractor = (item, index) => index.toString()
export default function MessagePatScreen({navigation}){
	const [inputMessage, setInputMessage] = useState('');

	const [chatUser, setDoc] = useState({});
	const [docId, setDocId] = useState(null);

	  const [currentUser, setUsers] = useState({});
 
	  const [messages, setMessages] = useState([]);

	  async function sendMessage() { 
	  	try{
		    if (inputMessage === '') {
		      return setInputMessage('');
		    }
		    let message = {
		    	senderId: auth().currentUser.uid,
		        message: inputMessage.trim(),
		        userId: auth().currentUser.uid,
		        docId: docId,
		        receiverId: docId,
		        time: new Date().toISOString(),
		        createdAt: new Date().getTime()
		    };
		    let chats = database().ref('messages/'+currentUser.docId+"/"+auth().currentUser.uid);
			chats.push(message)
			let nr = database().ref('noread/'+currentUser.docId+"/"+auth().currentUser.uid+'/doctor');
		    

		    nr.once('value', sna => {
		    	let count = sna?.val()?.count
		    	nr.update({count: count ? count+1 : 1})
		    })

		    let data = {
			  "notification":{
			    "title": chatUser.nom_complet,
			    "image":"https://mamed.care/wp-content/uploads/2020/05/logo_mamed.jpg",
			    "body": inputMessage.trim(),
			    "priority" :"high"
			  },
			  "android": {
			    "priority" :"high",
			    "notification": {
			    "title": chatUser.nom_complet,
			    "image":"https://mamed.care/wp-content/uploads/2020/05/logo_mamed.jpg",
			    "body": inputMessage.trim(),
			    "priority" :"high"
			    }
			  },
			  "priority": "high",
			  "to": chatUser.token
			}
			setInputMessage('');
		    const r =   fetch('https://fcm.googleapis.com/fcm/send', {
	           method: 'POST',
	           headers: { 
	           	'Content-Type': 'application/json',
	           	'Authorization': 'key=AAAAP7VCdt0:APA91bF5MdAIB1Z92mljdP_1fJsawD82CpHNydIDPQoKESEj4I-SPViZd358DpQU3DfktwYPSospp3Fpnh9LkfON_0k_1twb2XL5IPGIBxF8ywEtQHiq485YbialaCmEO8X6chBjh76t'
	           },
	           body: JSON.stringify(data)
	         });
		    console.log('====tokey########################""', r)
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
						setDocId(snapshot.val().docId);
						let chats = database().ref('messages/'+snapshot.val().docId+"/"+auth().currentUser.uid).orderByChild('createdAt', 'desc');
					    chats.on('value', (snapshot) => {
					      	if(snapshot.val()){
					      		database().ref('noread/'+snapshot.val().docId+"/"+auth().currentUser.uid+'/patient').update({count: 0})
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
				      		console.log('docId docId ###############', snapshot.val());
							setDoc(snapshot.val());
						});
					}
				}); 
				user.update({
					last_seen: 'online'
				})
		      	
		    })();
		    return () => {
		    	let user2 = database().ref('users/'+auth().currentUser.uid);
			    user2.update({
					last_seen: new Date().getTime()
				})
				console.log('è___________returns')
			  }
		  }, []);


	  

	return(
		<TouchableWithoutFeedback>
         <View style={styles.container}>
         		<FlatList
		          style={{ backgroundColor: '#f2f2ff' }}
		          inverted={true}
		          keyExtractor={_keyExtractor}
		          data={JSON.parse(JSON.stringify(messages))}
		          renderItem={({ item }) => (	
		            <View>	
				 		{item.senderId === currentUser.docId ?
				          (
				            <View style={[styles.container2, styles.positionToLeft]}>
				              <View style={[styles.message, styles.messageToLeft]}>
				                <Text style={[styles.messageText, (item.senderId === chatUser.docId ? styles.selfToLeft : styles.selfToRight)]}>
				                  {item.message || ' '}
				                </Text>
				                <Text style={styles.dateSent}>
				                  {item.time}
				                </Text>
				              </View>
				            </View>
				          ) :
				          ( 
				            <View style={[styles.container2, styles.positionToRight]}>
				              <View style={[styles.message, styles.messageToRight]}>
				                <Text style={[styles.messageText, styles.selfToRight]}>
				                  {item.message || ' '}
				                </Text>
				                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
				                  <Text style={styles.dateSent}>
				                    {item.time}
				                  </Text>
				                  <Icon name="done-all" size={12} color="#ffeb3b" />
				                </View>
				              </View>
				            </View>
				          )
			            }
			        </View>
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
		               editable={!!currentUser.docId}
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
  container2: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  positionToLeft: {
    justifyContent: 'flex-start'
  },
  positionToRight: {
    justifyContent: 'flex-end'
  },
  message: {
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  messageToLeft: {
    maxWidth: fullWidth - 90,
    borderBottomLeftRadius: 2,
    backgroundColor: '#63D9C6'
  },
  messageToRight: {
    maxWidth: fullWidth - 55,
    borderBottomRightRadius: 2,
    backgroundColor: '#48A6E3'
  },
  messageText: {
    fontSize: 16,
    color: 'white'
  },
  selfToLeft: {
    alignSelf: 'flex-start'
  },
  selfToRight: {
    alignSelf: 'flex-end'
  },
  dateSent: {
    alignSelf: 'flex-end',
    paddingTop: 1,
    paddingHorizontal: 3,
    fontSize: 12,
    color: 'lightcyan'
  }
});