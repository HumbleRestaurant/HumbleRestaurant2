import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {Payment} from '../../models/Payment.model';
import {Search} from '../../models/Search.model';
import {PaymentService} from '../../services/payment/payment.service';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from 'ng2-notify-popup';

@Component({
  selector: 'app-setting-receipt',
  templateUrl: './setting-receipt.component.html',
  styleUrls: ['./setting-receipt.component.css'],
  providers: [NotificationService]
})
export class SettingReceiptComponent implements OnInit, OnDestroy {
  @Input()
  user: User;

  receipts: Payment[];

  subscription: Subscription;
  search: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: null,
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  curSrc: string;

  constructor(
    private notify: NotificationService,
    private paymentService: PaymentService) { }

  ngOnInit() {
    if (this.user.role !== 'admin') {
      this.search.restaurantId = this.user.userId;
    }
    this.searchPayments();
  }

  searchPayments() {
    this.subscription =
      this.paymentService.searchPayments(this.search)
        .subscribe(res => this.receipts = res);
  }

  jumpPage(num: number) {
    this.search.page += num;

    if (this.search.page < 1) {
      this.search.page = 1;
    }

    this.searchPayments();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateReceipt(payment: Payment, status: number) {
    payment.status = status;
    this.paymentService.updatePayment(payment)
      .then((res) => {
        if (status === 1) {
          this.notify.show('Status changed: Accepted',
            {position: 'bottom', duration: '2000', type: 'success'});
        } else {
          this.notify.show('Status changed: Rejected',
            {position: 'bottom', duration: '2000', type: 'error'});
        }
      });
  }

  setCurUrl(url: string) {
    this.curSrc = url;
  }
}
