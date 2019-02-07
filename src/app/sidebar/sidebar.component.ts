import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {HubbleService} from '../services/hubble.service';
import {TaskService} from '../services/task.service';
import {Task} from '../model/task.model';

@Component({
  selector: 'mtm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  userConfig;
  _dashboard;
  assignId = '';
  assignName = '';
  lastKeypress = 0;
  empList = [];
  taskStatus = {
    Pending: false,
    inProgress: false,
    Complete: false
  };
  dueDate = {year: 0, month: 0, day: 0};
  searchInProgress = false;

  constructor(public dataService: DataService, private hubbleService: HubbleService, private taskService: TaskService) {
    this._dashboard = this.dataService._dashboardVal;
  }

  ngOnInit() {
    if (localStorage.getItem('userConfig')) {
      this.userConfig = JSON.parse(localStorage.getItem('userConfig'));
    } else {
      this.userConfig = {
        _filters: false,
        _aTasks: true,
        _wTasks: true,
        _rTasks: false,
        _cTasks: false
      };
      localStorage.setItem('userConfig', JSON.stringify(this.userConfig));
    }
    this.dataService._sidebarConfig = this.userConfig;
  }



  addAssignee(user) {
    this.assignId = user.LoginId;
    this.empList = [];
  }

  _toggleThis(component) {
    this.userConfig[component] = !this.userConfig[component];
    if (component === '_filters') {
      this.userConfig._aTasks = !this.userConfig._filters;
      this.userConfig._wTasks = !this.userConfig._filters;
      this.userConfig._rTasks = !this.userConfig._filters;
      this.userConfig._cTasks = !this.userConfig._filters;
    } else if (! (this.userConfig._aTasks || this.userConfig._wTasks || this.userConfig._rTasks || this.userConfig._cTasks)) {
      this.userConfig[component] = !this.userConfig[component];
    }
    this.dataService._sidebarConfig = this.userConfig;
    localStorage.setItem('userConfig', JSON.stringify(this.userConfig));
  }

  searchTasks(data) {
    this.searchInProgress = true;
    this.dataService._searchStatus.next('SEARCH_PROGRESS');
    this.dataService._searchResults.next([]);
    let searchQuery;
    searchQuery = data;
    const task_status: string[] = [];
    for (let key in this.taskStatus) {
      if (this.taskStatus[key]) {
        if (key === 'inProgress') {
          key = 'In Progress';
        }
        task_status.push(key);
      }
    }
    searchQuery['task_status'] = [];
    searchQuery['task_status'] = task_status;
    searchQuery['assignee'] = this.assignId;
    if (this.dueDate && this.dueDate.year && this.dueDate.month && this.dueDate.day) {
      const tempDate = new Date();
      tempDate.setUTCDate(this.dueDate.day);
      tempDate.setUTCMonth(this.dueDate.month - 1);
      tempDate.setUTCFullYear(this.dueDate.year);
      /* tempDate.setHours(0);
       tempDate.setMinutes(0);
       tempDate.setSeconds(0);
       tempDate.setMilliseconds(0);*/
      searchQuery['dueDate'] = tempDate.toISOString();
      // searchQuery['dueDate'] = this.dueDate.month + '/' + this.dueDate.day + '/' + this.dueDate.year;
    } else {
      searchQuery['dueDate'] = '';
    }
    this.taskService.searchTasks(searchQuery).subscribe((response) => {
      this.dataService._searchResults.next(Object.assign(new Array<Task>(), response));
      this.searchInProgress = false;
      this.dataService._searchStatus.next('SEARCH_COMPLETE');
    });
  }

  getSuggestion($event) {
    if ($event.target.value.length > 3 && $event.timeStamp - this.lastKeypress > 200) {
      this.hubbleService.suggest($event.target.value)
        .subscribe((empList) => {
          this.empList = empList['employees'];
        });
    } else {
      this.empList = [];
    }
  }


}
