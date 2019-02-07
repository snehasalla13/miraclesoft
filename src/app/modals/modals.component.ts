import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

import {Task} from '../model/task.model';
import {Status} from '../model/status.model';
import {TaskService} from '../services/task.service';
import {HubbleService} from '../services/hubble.service';
import {User} from '../model/user.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'mtm-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.less'],
})
export class ModalsComponent implements OnInit {

  public isCollapsed = true;
  task;
  @Output() fetchTasks = new EventEmitter();
  @ViewChild('createTaskModal') createTaskModal: ElementRef;
  public descriptionLength = 0;
  public editdescriptionLength = 0;
  public statusDesc;
  empList = [];
  lastKeypress = 0;
  assignName;
  watcherName;
  watchers;
  assignId;
  watcher;
  listOfWatchers;
  loggedInUser: User;

  constructor(private taskService: TaskService, private hubbleService: HubbleService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  }

  openModal(modalID) {
    this.modalService.open(modalID);
  }

  addAssignee(name) {
    this.assignName = name.EmployeeName;
    this.assignId = name.LoginId;
    this.empList = null;
  }


  addWatcher(user) {
    if (this.watcher === user) {
      this.listOfWatchers.push(user);
      this.listOfWatchers = this.listOfWatchers.filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
      });
      this.empList = null;
      this.watcher = null;
    }
  }

  setWatcher(user) {
    this.watcher = user;
    this.empList = null;
  }

  deleteWatcher(user) {
    for (let i = 0; i < this.listOfWatchers.length; i++) {
      if (this.listOfWatchers[i] === user) {
        this.listOfWatchers.splice(i, 1);
      }
    }
  }

  getSuggestion($event) {
    if ($event.target.value.length > 1 && $event.timeStamp - this.lastKeypress > 200) {
      this.hubbleService.suggest($event.target.value)
        .subscribe((empList) => {
          this.empList = empList['employees'];
        });
    }
  }

  createTask(data) {
    console.log(data);
    let task: Task;
    task = data;
    task.assignedTo = this.assignId;
    task.owner = this.loggedInUser.LoginId;
    console.log(task);
    this.taskService.createTask(task, this.loggedInUser).subscribe((response) => {
      console.log(response);
    });
    this.fetchTasks.emit();
  }


  addStatus(formData) {
    console.log(formData);
    const status = new Status();
    status.desc = formData.desc;
    status.updateBy = this.loggedInUser.LoginId;
    const data = {
      'completionPercent': formData.completionPercent,
      'newstatus': 'pending',
      'statusUpdate': status
    };
    this.taskService.addStatus(this.task, data, this.loggedInUser).subscribe(res => {
      this.fetchTasks.emit();
    });
  }

  editTask() {
    this.taskService.updateTask(this.task, this.loggedInUser, false).subscribe(res => {
      this.fetchTasks.emit();
    });
  }

  reAssignTask() {
    this.task.assignedTo = this.assignId;
    this.taskService.updateTask(this.task, this.loggedInUser, true).subscribe(res => {
      this.fetchTasks.emit();
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task, this.loggedInUser).subscribe(res => {
      this.fetchTasks.emit();
    });

  }


}
