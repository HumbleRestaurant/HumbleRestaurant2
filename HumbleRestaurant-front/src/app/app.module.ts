import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './componenets/home/home.component';
import { NavHomeComponent } from './componenets/nav-home/nav-home.component';
import {RestaurantService} from './services/restaurant/restaurant.service';
import {Routing} from './app.router';
import { RestaurantComponent } from './componenets/restaurant/restaurant.component';
import { DonorComponent } from './componenets/donor/donor.component';
import { AboutComponent } from './componenets/about/about.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { StarRatingModule } from 'angular-star-rating';
import { CarouselModule } from 'angular4-carousel';
import { RatingComponent } from './componenets/rating/rating.component';
import {RatingService} from './services/rating/rating.service';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './componenets/map/map.component';
import {UserService} from './services/user/user.service';
import { SearchComponent } from './componenets/search/search.component';
import { ProfileComponent } from './componenets/profile/profile.component';
import {FormsModule} from '@angular/forms';
import {PaymentService} from './services/payment/payment.service';
import {HttpModule} from '@angular/http';
import {GeohashService} from './services/geohash/geohash.service';
import {AuthService} from './services/auth/auth.service';
import { CallbackComponent } from './componenets/callback/callback.component';
import {FavService} from './services/fav/fav.service';
import { BlankComponent } from './componenets/blank/blank.component';
import { ErrorComponent } from './componenets/error/error.component';
import { SettingComponent } from './componenets/setting/setting.component';
import { SettingRestaurantComponent } from './componenets/setting-restaurant/setting-restaurant.component';
import { SettingUserComponent } from './componenets/setting-user/setting-user.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {FileService} from './services/file/file.service';
import { SettingReceiptComponent } from './componenets/setting-receipt/setting-receipt.component';
import { SettingRoleComponent } from './componenets/setting-role/setting-role.component';
import { InlineEditionModule } from 'angular2-inline-edition';
import { SettingRestaurantsComponent } from './componenets/setting-restaurants/setting-restaurants.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SettingDonorComponent } from './componenets/setting-donor/setting-donor.component';
import { PaymentComponent } from './componenets/payment/payment.component';
import { NgNotifyPopup } from 'ng2-notify-popup';
import { ImageViewComponent } from './componenets/image-view/image-view.component';

import { LoadingAnimateModule, LoadingAnimateService } from 'ng2-loading-animate';
import {DonorService} from './services/donor/donor.service';
import {GroupService} from './services/group/group.service';
import { SettingGroupComponent } from './componenets/setting-group/setting-group.component';
import { GroupComponent } from './componenets/group/group.component';
import { GroupsComponent } from './componenets/groups/groups.component';
import { SettingGroupsComponent } from './componenets/setting-groups/setting-groups.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavHomeComponent,
    RestaurantComponent,
    DonorComponent,
    AboutComponent,
    RatingComponent,
    MapComponent,
    SearchComponent,
    ProfileComponent,
    CallbackComponent,
    BlankComponent,
    ErrorComponent,
    SettingComponent,
    SettingRestaurantComponent,
    SettingUserComponent,
    SettingReceiptComponent,
    SettingRoleComponent,
    SettingRestaurantsComponent,
    SettingDonorComponent,
    PaymentComponent,
    ImageViewComponent,
    SettingGroupComponent,
    GroupComponent,
    GroupsComponent,
    SettingGroupsComponent
  ],
  imports: [
    LoadingAnimateModule.forRoot(),
    HttpModule,
    BrowserModule,
    CarouselModule,
    FormsModule,
    InlineEditionModule,
    AngularFontAwesomeModule,
    StarRatingModule.forRoot(),
    ImageUploadModule.forRoot(),
    TabsModule.forRoot(),
    Routing,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD1Bnn60r9X04C24OjN_CLzwCg1cGJI70A'
    }),
    NgNotifyPopup
  ],
  providers: [
    AuthService,
    LoadingAnimateService,
    RestaurantService,
    RatingService,
    UserService,
    PaymentService,
    GeohashService,
    FavService,
    FileService,
    DonorService,
    GroupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
