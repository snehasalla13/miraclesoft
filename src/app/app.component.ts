import {Component, OnInit} from '@angular/core';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  loggedIn;
  _sidebar;
  screenSize = 'BIG';

  constructor(public dataService: DataService) {
    window.addEventListener('resize', this.updateSidebarMode);
  }

  ngOnInit() {
    if (localStorage.getItem('loggedIn')) {
      this.loggedIn = localStorage.getItem('loggedIn');
    } else {
      this.loggedIn = false;
    }

    this._sidebar = this.dataService._sidebarVal;
    if (window.innerWidth <= 800 && window.innerHeight <= 825) {
      this.screenSize = 'SMALL';
    } else {
      this.screenSize = 'BIG';
    }

  }

  updateSidebarMode() {
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      this.screenSize = 'SMALL';
    } else {
      this.screenSize = 'BIG';
    }
  }


  setAuth(passAuth) {
    this.loggedIn = passAuth;
  }
}
