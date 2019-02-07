import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {Task} from '../../model/task.model';
import {User} from '../../model/user.model';
import {HubbleService} from '../../services/hubble.service';
import {Status} from '../../model/status.model';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'mtm-task-detail-page',
  templateUrl: './task-detail-page.component.html',
  styleUrls: ['./task-detail-page.component.less'],
})
export class TaskDetailPageComponent implements OnInit {

  task: Task;
  currentTask: Task = new Task();
  loggedInUser: User;
  empListAssignee = [];
  empListWatcher = [];
  lastKeypress = 0;
  watcherName;
  assignId;
  statusDesc = '';
  watcher;
  loading = true;
  dueDate = {'year': 0, 'month': 0, 'day': 0};
  minDate = {'year': 0, 'month': 0, 'day': 0};


  @ViewChild('editTaskForm') editTaskForm: any;
  @ViewChild('addStatusForm') addStatusForm: any;
  @ViewChild('reAssignForm') reAssignForm: any;


  constructor(private taskService: TaskService, private route: ActivatedRoute,
              private hubbleService: HubbleService, private dataService: DataService, private router: Router) {
    let _dashboard;
    _dashboard = true;
    this.dataService._dashboardVal = _dashboard;

    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  }


  resetCurrentTask() {
    this.currentTask = Object.assign(new Task(), this.task);
    this.assignId = this.loggedInUser.LoginId;
    this.currentTask.watchers = Object.assign([], this.task.watchers);
    const date = new Date(this.currentTask.dueDate);
    this.dueDate.year = date.getUTCFullYear();
    this.dueDate.month = date.getUTCMonth() + 1;
    this.dueDate.day = date.getUTCDate();

    this.minDate.year = date.getUTCFullYear();
    this.minDate.month = date.getUTCMonth() + 1;
    this.minDate.day = date.getUTCDate();

    this.editTaskForm.form.get('dueDate').setValue(this.dueDate);
    /** reset the form validations and mark them as untouched **/
    this.editTaskForm.form.markAsUntouched();
    this.editTaskForm.form.markAsPristine();

    this.addStatusForm.form.markAsUntouched();
    this.addStatusForm.form.markAsPristine();

    this.reAssignForm.form.markAsUntouched();
    this.reAssignForm.form.markAsPristine();
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    this.taskService.getTask(this.route.snapshot.paramMap.get('id')).subscribe(response => {
      this.task = Object.assign(new Task(), response[0]);
      this.currentTask = Object.assign(new Task(), response[0]);
      this.assignId = this.loggedInUser.LoginId;
      this.currentTask.watchers = Object.assign([], this.task.watchers);
      this.loading = false;
      const date = new Date(this.currentTask.dueDate);
      this.dueDate.year = date.getUTCFullYear();
      this.dueDate.month = date.getUTCMonth() + 1;
      this.dueDate.day = date.getUTCDate();

      this.minDate.year = date.getUTCFullYear();
      this.minDate.month = date.getUTCMonth() + 1;
      this.minDate.day = date.getUTCDate();
    });
  }

  addAssignee(name) {
    this.assignId = name.LoginId;
    this.empListAssignee = [];
  }

  getSuggestion($event, operation) {
    if ($event.target.value.length > 3 && $event.timeStamp - this.lastKeypress > 200) {
      this.hubbleService.suggest($event.target.value)
        .subscribe((empList) => {
          if (operation === 'assignee') {
            this.empListAssignee = empList['employees'];
          } else if (operation === 'watcher') {
            this.empListWatcher = empList['employees'];
          }
        });
    } else {
      this.empListAssignee = [];
      this.empListWatcher = [];
    }
  }


  addStatus(formData) {
    const status: Status = new Status();
    status.updateBy = this.loggedInUser.LoginId;
    status.desc = this.statusDesc;
    status.percentage = formData.completionPercent;
    const data = {
   /*   'completionPercent': formData.completionPercent,
      'newstatus': 'pending',*/
      'statusUpdate': status
    };
    this.taskService.addStatus(this.task, data, this.loggedInUser).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      this.resetCurrentTask();
    });
  }

  editTask(formData) {
    const tempDate = new Date(this.task.dueDate);
    tempDate.setFullYear(formData.dueDate.year, formData.dueDate.month - 1, formData.dueDate.day);
    this.currentTask.dueDate = tempDate.toISOString();
    this.currentTask.assignedTo = this.assignId;
    this.taskService.updateTask(this.currentTask, this.loggedInUser, false).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      this.resetCurrentTask();
    });
  }

  reAssignTask() {
    if ( this.currentTask.assignedTo !== this.assignId) {
      this.currentTask.assignedTo = this.assignId;
      this.taskService.updateTask(this.currentTask, this.loggedInUser, true).subscribe(res => {
        this.task = Object.assign(new Task(), res);
        this.resetCurrentTask();
      });
    }
  }

  deleteTask() {
    this.taskService.deleteTask(this.task, this.loggedInUser).subscribe(res => {
      this.router.navigate(['/']);
    });

  }

  subscribe() {
    this.taskService.addWatcher(this.task, this.loggedInUser).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      this.resetCurrentTask();
    });
  }

  unsubscribe() {
    this.taskService.deleteWatcher(this.task, this.loggedInUser).subscribe(res => {
      this.task = Object.assign(new Task(), res);
      this.resetCurrentTask();
    });
  }

  addWatcher(user) {
    // if (this.watcher.EmployeeName === user) {
    this.currentTask.watchers.push(user.LoginId);
    this.currentTask.watchers = this.currentTask.watchers.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    this.empListWatcher = [];
    this.watcher = null;
    this.watcherName = null;
    // }
  }

  setWatcher(user) {
    this.watcher = user;
    this.empListWatcher = [];
    this.watcherName = user.EmployeeName;
  }

  deleteWatcher(user) {
    for (let i = 0; i < this.currentTask.watchers.length; i++) {
      if (this.currentTask.watchers[i] === user) {
        this.currentTask.watchers.splice(i, 1);
      }
    }
  }


}
