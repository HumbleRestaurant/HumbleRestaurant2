import {Component, Input, OnInit} from '@angular/core';
import {Restaurant} from '../../models/Restaurant.model';
import swal from 'sweetalert2';
import {FileService} from '../../services/file/file.service';
import {PaymentService} from '../../services/payment/payment.service';
import { NotificationService } from 'ng2-notify-popup';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [NotificationService]
})
export class PaymentComponent implements OnInit {
  @Input()
  restaurant: Restaurant;

  payment = {
    userId: '',
    restaurantId: '',
    userName: '',
    restaurantName: '',
    amount: 0,
    donation: 0,
    url: '',
    status: 0
  };

  constructor(private paymentService: PaymentService,
              private notify: NotificationService,
              private fileService: FileService) { }

  ngOnInit() {
    this.payment.userId = localStorage.getItem('user_id');
    this.payment.userName = localStorage.getItem('name');
    this.payment.restaurantId = this.restaurant.ownerId;
    this.payment.restaurantName = this.restaurant.name;
  }

  receiptUpload(files: File[]) {
    const file = files[0];
    const formData = new FormData();

    const arr = file.name.split('.');
    if (arr.length < 2) {
      swal('File type doesn\'t support', file.name, 'error');
      return;
    }
    if ( arr[arr.length - 1] !== 'png' && arr[arr.length - 1] !== 'jpg' &&
      arr[arr.length - 1] !== 'svg' && arr[arr.length - 1] !== 'gif') {
      swal('File type doesn\'t support', file.name , 'error');
      return;
    }

    formData.append('name', 'receipt-' + this.payment.userId + '-' +
      this.restaurant.ownerId + '-' + Date.now() + '.' + arr[arr.length - 1]);
    formData.append('file', file);

    this.fileService.uploadFile(formData)
      .then(res => {
        this.payment.url = res.path;
      });
  }

  addPayment() {
    if (this.payment.amount === 0) {
      swal('Enter your payment amount', '', 'error');
      return;
    }

    this.payment.donation = this.payment.amount * ( this.restaurant.percentage / 100 );

    this.paymentService.addPeyment(this.payment)
      .then( (res) => {
        this.showModular('success', '');
      });
  }

  showModular(text: string, type: string): void {
    this.notify.show(text, { position: 'bottom', duration: '2000', type: 'success' });
  }
}
