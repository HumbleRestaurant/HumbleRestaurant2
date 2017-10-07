import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {DonorService} from '../../services/donor/donor.service';
import {Donor} from '../../models/donor.model';
import {PaymentService} from '../../services/payment/payment.service';
import { NotificationService } from 'ng2-notify-popup';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-setting-donor',
  templateUrl: './setting-donor.component.html',
  styleUrls: ['./setting-donor.component.css'],
  providers: [NotificationService]
})
export class SettingDonorComponent implements OnInit, OnDestroy {
  @Input()
  user: User;

  userDuration = 'day';
  donorUsers: Donor[];
  userSubscription: Subscription;
  showUserUpdate = false;

  restaurantDuration = 'day';
  donorRestaurants: Donor[];
  restaurantSubscription: Subscription;
  showRestaurantUpdate = false;

  constructor(
    private notify: NotificationService,
    private paymentService: PaymentService,
    private donorService: DonorService
  ) { }

  ngOnInit() {
    this.getUserDonors();
    this.getRestaurantDonors();
  }

  getUserDonors() {
    this.userSubscription =
      this.donorService.getDonors('user', this.userDuration)
        .subscribe(res => this.donorUsers = res);
  }

  changeUserDuration(duration: string) {
    this.userDuration = duration;
    this.getUserDonors();
  }

  getRestaurantDonors() {
    this.restaurantSubscription =
      this.donorService.getDonors('restaurant', this.restaurantDuration)
        .subscribe(res => this.donorRestaurants = res);
  }

  changeRestaurantDuration(duration: string) {
    this.restaurantDuration = duration;
    this.getRestaurantDonors();
  }

  generateUser() {
    this.donorService.generateDonors('user', this.userDuration)
      .then((res) => {
        this.donorUsers = res;
        this.showUserUpdate = true;
      });
  }

  updateUser() {
    this.donorService.updateDonors('user', this.userDuration, this.donorUsers)
      .then((res) => {
        this.showUserUpdate = false;
        this.notify.show('Contributors for ' + this.userDuration + ' has been updated ',
          { position: 'bottom', duration: '2000', type: 'success' });
      });
  }

  generateRestaurant() {
    this.donorService.generateDonors('restaurant', this.restaurantDuration)
      .then((res) => {
        this.donorRestaurants = res;
        this.showRestaurantUpdate = true;
      });
  }

  updateRestaurant() {
    this.donorService.updateDonors('restaurant', this.restaurantDuration, this.donorRestaurants)
      .then((res) => {
        this.showRestaurantUpdate = false;
        this.notify.show('Restaurants for ' + this.restaurantDuration + ' has been updated ',
          { position: 'bottom', duration: '2000', type: 'success' });
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.restaurantSubscription.unsubscribe();
  }
}
