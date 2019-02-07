import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
// components
import {AppComponent} from './app.component';
import {TopbarComponent} from './topbar/topbar.component';
import {LoginComponent} from './login/login.component';
import {TaskBoardComponent} from './task-board/task-board.component';
import {SampleComponent} from './sample/sample.component';
// services
import {TaskService} from './services/task.service';
import {HubbleService} from './services/hubble.service';
import {DataService} from './services/data.service';
import {FooterComponent} from './footer/footer.component';
import {TaskCardComponent} from './task-board/task-card/task-card.component';
import {TaskDetailPageComponent} from './task-board/task-detail-page/task-detail-page.component';
import {ProfileComponent} from './profile/profile.component';
import {SidebarModule} from 'ng-sidebar';
import {NouisliderModule} from 'ng2-nouislider';
import {ModalsComponent} from './modals/modals.component';
import {NotificationService} from './services/notification.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorsHandler} from './error-handlers/errors-handler';
import {ServerErrorsInterceptor} from './error-handlers/server-error.interceptor';
import {ErrorUiComponentComponent} from './error-handlers/error-ui-component/error-ui-component.component';
import {TokenInterceptor} from './auth/TokenInterceptor';
import {AuthService} from './auth/auth.service';
import {ServiceWorkerModule} from '@angular/service-worker';
import * as firebase from 'firebase';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule, ToastOptions} from 'ng2-toastr';
import { ToastComponent } from './toast-component/toast-component.component';
import {ToastService} from './services/toast.service';
import {environment} from '../environments/environment';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { EmployeeboardComponent } from './employeeboard/employeeboard.component';
import {ProfileService} from './services/profile.service';
import {ChartsModule} from 'ng2-charts';
import {MtalkService} from './services/mtalk.service';
import { DataTablesModule } from 'angular-datatables';


firebase.initializeApp(environment.firebaseConfig);
const appRoutes: Routes = [
  {path: '', component: TaskBoardComponent},
  {path: 'home', component: TaskBoardComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
  {path: 'employeeboard', component: EmployeeboardComponent},
  {path: 'tasks/:id', component: TaskDetailPageComponent},
  // {path: 'profile', component: ProfileComponent},
  {path: 'profile/:userid', component: ProfileComponent},
  {path: 'error', component: ErrorUiComponentComponent},
  {path: 'sample', component: SampleComponent}
];

export class CustomOption extends ToastOptions {
  animate = 'flyRight'; // you can override any options available
  positionClass = 'toast-bottom-right';
}

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    TaskBoardComponent,
    LoginComponent,
    FooterComponent,
    TaskCardComponent,
    TaskDetailPageComponent,
    ProfileComponent,
    ModalsComponent,
    SidebarComponent,
    ErrorUiComponentComponent,
    ToastComponent,
    LeaderboardComponent,
    EmployeeboardComponent,
    SampleComponent
  ],
  imports: [
    FormsModule,
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    SidebarModule.forRoot(),
    HttpClientModule,
    DataTablesModule,
    NouisliderModule,
    RouterModule.forRoot(appRoutes),
    NgbDropdownModule.forRoot(),
    ToastModule.forRoot(),
    ChartsModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorsInterceptor,
    multi: true,
  }, {
    provide: ErrorHandler,
    useClass: ErrorsHandler,
  }, {
    provide: ToastOptions,
    useClass: CustomOption
  },
    AuthService,
    TaskService,
    HubbleService,
    DataService,
    NotificationService,
    ToastService,
    ProfileService,
    MtalkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
