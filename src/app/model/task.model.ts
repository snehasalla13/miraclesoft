import {User} from './user.model';
import {Status} from './status.model';
import {getDate} from 'ngx-bootstrap/chronos/utils/date-getters';

export class Task {
  completionPercent: number;
  status: string;
  watchers: any[];
  _id: string;
  projectName: string;
  title = '';
  desc = '';
  owner: string;
  dueDate: string;
  assignedTo: string;
  statusUpdates: Status[];
  createdAt: string;
  remindFor: number;
  newTask = false;

  public getUserRole( user: User): string {
    let role = 'ROLE_NONE';
    if (this.assignedTo === user.LoginId) {
      role = 'ROLE_ASSIGNEE';
    } else {
      for (const index in this.watchers) {
        if (this.watchers[index] === user.LoginId) {
          role = 'ROLE_WATCHER';
        }
      }
    }
    return role;
  }

  public isDueToday(): boolean {

    const currentDate = new Date();
    if (this) {
      const taskDueDate = new Date(this.dueDate);
      if (this.getDate(taskDueDate) === this.getDate(currentDate)) {
        return true;
      }
    }
    return false;
  }

  public isOverDue(): boolean {

    const currentDate = new Date();
    if (this) {
      const taskDueDate = new Date(this.dueDate);
      if (taskDueDate < currentDate) {
        return true;
      }
    }
    return false;
  }

  private getDate(date: Date) {
    return (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();
  }


  public getProgressBarColor(): string {
    let progressBarColor = 'bg-success';

    if (this) {
      if (this.completionPercent > -1 && this.completionPercent <= 25) {
        progressBarColor = 'bg-danger';
      } else if (this.completionPercent > 25 && this.completionPercent <= 75) {
        progressBarColor = 'bg-warning';
      }
    }
    return progressBarColor;
  }

}
