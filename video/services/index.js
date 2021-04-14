import Auth from './auth-service';
import Call from './call-service';

let session;
let extension;
 class xx {
 
 setSession = (sess) => {
 		session = sess;
 }

 getSession = () => {
 		return session;
 }

 setEX = (ex) => {
 		extension = ex;
 }

 getEx = () => {
 	return extension;
 };

}
export const AuthService = new Auth();
export const CallService = new Call();
export const x = new xx();