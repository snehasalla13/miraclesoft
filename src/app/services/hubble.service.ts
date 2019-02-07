import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class HubbleService {
  private baseURL = environment.serverBaseURL;

  constructor(public http: HttpClient) {
  }

  checkAuth(user) {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const loginData = {
      'LoginId': user.userid,
      'Password': user.password,
    };

    return this.http.post(this.baseURL + `login`, loginData, {headers : headers});
  }

  suggest(data) {
    const json = JSON.stringify({
      'SearchKey': data,
      'Authorization': 'YWRtaW46YWRtaW4='
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('https://www.miraclesoft.com/HubbleServices/hubbleresources/mconEmployeeServices/getMconEmployeeSuggestionList',
      json, {headers: headers});
  }

  getUserDetails(LoginId: string) {
    this.suggest(LoginId).subscribe((response) => {
      return response;
    });
  }
}
