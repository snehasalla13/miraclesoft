import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HubbleService} from '../services/hubble.service';
import {User} from '../model/user.model';
import {Router} from '@angular/router';


@Component({
  selector: 'mtm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  user: User;
  error = false;
  @Output() passAuth = new EventEmitter<boolean>();
  loginInProgress = true;
  showProgress = false;

  constructor(private hubbleService: HubbleService, private router: Router) {
  }

  login(value) {
    this.showProgress = true;
    this.loginInProgress = true;
    const loginData = {
      'userid': value.userid,
      'password': value.password
    };
    this.hubbleService.checkAuth(loginData)
      .subscribe((response) => {
        /** Token is present only when it is a valid login **/
        if (response['token'] && response['userObject']['PracticeId'] === 'LABS') {
          localStorage.setItem('token', response['token']);
          const authResponse = response['userObject'];
          this.user = new User();
          this.user = authResponse;
          this.user.password = loginData.password;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('loggedInUser', JSON.stringify(this.user));
          this.passAuth.emit(true);
          this.router.navigate(['/']);
        } else {
          this.loginInProgress = false;
          this.showProgress = false;
          this.error = true;
        }
      });
  }

}
