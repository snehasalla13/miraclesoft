import {Component, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {ToastService} from '../services/toast.service';

@Component({
  selector: 'mtm-toast-component',
  template: '',
  styles: []
})
export class ToastComponent {
   toastMessage: string;
  toastType: string;
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private toastService: ToastService) {
    this.toastr.setRootViewContainerRef(vcr);

    this.toastService.getToastMessage().subscribe((toastObj) => {
      this.toastMessage = toastObj.message;
      this.toastType = toastObj.type;
      this.showToast(this.toastType);
    });
  }

  public showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  public showError(message) {
    this.toastr.error(message, 'Oops!');
  }

  public showWarning(message) {
    this.toastr.warning(message, 'Alert!');
  }

  public showInfo(message) {
    this.toastr.info(message);
  }
/*
  showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  }*/

  showToast(toastType: string) {
    switch (toastType) {
      case 'TYPE_SUCCESS' : this.showSuccess(this.toastMessage); break;
      case 'TYPE_ERROR' : this.showError(this.toastMessage); break;
      case 'TYPE_WARNING' : this.showWarning(this.toastMessage); break;
      case 'TYPE_INFO' : this.showInfo(this.toastMessage); break;
    }
    const audio = new Audio();
    audio.src = '../../assets/sound/notification.mp3';
    audio.load();
    audio.play();
  }
}
