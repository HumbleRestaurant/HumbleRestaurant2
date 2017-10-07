import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './componenets/home/home.component';
import {RestaurantComponent} from './componenets/restaurant/restaurant.component';
import {DonorComponent} from './componenets/donor/donor.component';
import {AboutComponent} from './componenets/about/about.component';
import {SearchComponent} from './componenets/search/search.component';
import {ProfileComponent} from './componenets/profile/profile.component';
import {CallbackComponent} from './componenets/callback/callback.component';
import {SettingComponent} from './componenets/setting/setting.component';
import {GroupComponent} from './componenets/group/group.component';
import {GroupsComponent} from './componenets/groups/groups.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'donor',
    component: DonorComponent
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'group/:ownerId',
    component: GroupComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'restaurant/:id',
    component: RestaurantComponent
  },
  {
    path: 'setting',
    component: SettingComponent
  },
  {
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'search/:keyword/:location',
    component: SearchComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

export const Routing = RouterModule.forRoot(routes);
