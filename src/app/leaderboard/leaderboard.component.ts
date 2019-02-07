import {Component, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {DataService} from '../services/data.service';

@Component({
  selector: 'mtm-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.less']
})
export class LeaderboardComponent implements OnInit {

  empList = [];
  loggedInUser;
  userProfile;

  constructor(private profileService: ProfileService, private dataService: DataService) {

    let _dashboard;
    _dashboard = true;
    this.dataService._dashboardVal = _dashboard;

    this.profileService.getLeaderBoard().subscribe(res => {
      this.empList = Object.assign([], res['topList']);
      this.userProfile = res['userprofile'];
      console.log(this.empList);
      console.log(res);
        });
  }

  ngOnInit() {

    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  }


  toFloat(str) {
    return Number.parseFloat(str);
  }

  getDifference(num1, num2) {
    num1 = this.toFloat(num1);
    num2 = this.toFloat(num2);
    if (num1 > num2) {
      return (num1 - num2).toFixed(2);
    } else {
      return (num2 - num1).toFixed(2);
    }
  }

}
