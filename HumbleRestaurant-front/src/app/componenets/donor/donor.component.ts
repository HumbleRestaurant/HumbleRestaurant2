import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {Donor} from '../../models/donor.model';
import {DonorService} from '../../services/donor/donor.service';


@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})

export class DonorComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  restaurantSubscription: Subscription;

  userDuration = 'day';
  users: Donor[];

  restaurantDuration = 'day';
  restaurants: Donor[];

  constructor(
    private _loadingSvc: LoadingAnimateService,
    private donorService: DonorService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.getUsers();
    this.getRestaurants();
  }

  getUsers() {
    this.userSubscription = this.donorService.getDonors('user', this.userDuration)
      .subscribe(res => this.users = res);
  }

  getRestaurants() {
    this.restaurantSubscription = this.donorService.getDonors('restaurant', this.restaurantDuration)
      .subscribe(res => this.restaurants = res);
  }

  changeRestaurantDuration(duration: string) {
    this.restaurantDuration = duration;
    this.getRestaurants();
  }

  changeUserDuration(duration: string) {
    this.userDuration = duration;
    this.getUsers();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.restaurantSubscription.unsubscribe();
  }
}
