import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastService} from './toast.service';

@Injectable()
export class ProfileService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseURL = environment.serverBaseURL;
  loggedInUser;

  constructor(public http: HttpClient, private toastService: ToastService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  }

  saveProfileSettings(data) {
    return this.http.put(this.baseURL + `user/${this.loggedInUser.LoginId}/profile`, data);
    // this.toastService.sendToastMessage('Profile saved successfully!', 'TYPE_SUCCESS');
  }

  getProfileInformation(userid) {
    console.log('in service', userid);
    return this.http.get(this.baseURL + `user/${userid}/profile`);
  }

  // getProfileInformation() {
  //   return this.http.get(this.baseURL + `user/${this.loggedInUser.LoginId}/profile`);
  // }

  getEmployeeBoard() {
    return this.http.get(this.baseURL + `users/employees_list`);
  }

  getLeaderBoard() {
    return this.http.get(this.baseURL + `user/${this.loggedInUser.LoginId}/topProfiles`);
  }


}
