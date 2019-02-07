import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class MtalkService {
  mTalkServerAddress = 'http://talk.miraclesoft.com:3000';

  const;
  headers = new HttpHeaders({
    'X-Auth-Token': 'kibl_liQclrLVSrBteR0aikVpza7MmYMDDPrS8NaWpc',
    'X-User-Id': '3g5f7aRyFLjYKP6no',
    'Content-type': 'application/json'
  });


  constructor(private http: HttpClient) {
  }


  getMtalkUserIDs(usersArray) {
    const apiUrl = `${this.mTalkServerAddress}/api/v1/users.list?query={"username":{"$in":"${usersArray}"}}`;
    // return this.http.get(apiUrl, {headers: this.headers});
    return Observable.empty();
  }


  sendMessage(msgParams) {
    // header is currently using MsstatusBot userID and authToken
    const apiUrl = `${this.mTalkServerAddress}/api/v1/chat.postMessage`;

    this.http.post(apiUrl, msgParams, {headers: this.headers}).subscribe();
  }


}

