import {Injectable} from '@angular/core';

import * as firebase from 'firebase';
import 'firebase/messaging';
import 'rxjs/add/operator/take';
import {Task} from '../model/task.model';
import {DataService} from './data.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class NotificationService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseURL = environment.serverBaseURL;

 messaging;
  loggedInUser;
   audio = new Audio();


  constructor(public http: HttpClient, private dataService: DataService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    try {
      this.messaging = firebase.messaging();
    } catch (error) {
      console.log(error.message);
    }
  }

  /** Create or Update token on the server for notification service **/
  updateToken(token) {
    return this.http.post(this.baseURL + `users/token`, {'token': token,
     'username': this.loggedInUser.LoginId, 'name': this.loggedInUser.FName},
      {headers: this.headers}).subscribe();
  }

  /** Get token for a particular user **/
  getToken(loginId) {
    return this.http.get(this.baseURL + `user/${loginId}/token`);
  }

  /** Request permission for sending notifications using browser **/
  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        // console.log('Notification permission granted.');
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
      })
      .catch((err) => {
        // console.log('Unable to get permission to notify.', err);
      });
  }

  /** Handler to receive notification messages inside the application **/
  receiveMessage() {
    this.messaging.onMessage((payload) => {
      // console.log('Message received. ', payload);
      this.dataService._notification.next(payload);
      this.audio.src = '../../assets/sound/notification.mp3';
      this.audio.load();
      this.audio.play();
    });

  }


  /** function to send a notification message to a user **/
  sendMessage(task: Task, messageBody, loginId) {
    const fcmHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + environment.fcmAuthHeader /** Auth token generated in firebase console **/
    });
    let tokenObj;

    this.getToken(loginId).subscribe((res) => {
      tokenObj = res;
      if (tokenObj != null) {
        const requestBody = {
          'notification': {
            'title': 'mStatus',
            'body': messageBody,
            'click_action': '/tasks/' + task._id,
            'icon': './assets/img/logo/icon.png',
            'badge': './assets/img/logo/icon.png'
          },
          'to': tokenObj[0]['token'],
        };

        this.http.post(`https://fcm.googleapis.com/fcm/send`, requestBody,
          {headers: fcmHeaders}).subscribe();
      }
      return;
    });


  }


}
