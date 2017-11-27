import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/User.model';
import {AuthService} from '../../services/auth/auth.service';
import {FileService} from '../../services/file/file.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {UserService} from '../../services/user/user.service';
import swal from 'sweetalert2';
import {Group} from '../../models/Group';
import {GeohashService} from '../../services/geohash/geohash.service';
import {GroupService} from '../../services/group/group.service';

@Component({
  selector: 'app-setting-user',
  templateUrl: './setting-user.component.html',
  styleUrls: ['./setting-user.component.css']
})
export class SettingUserComponent implements OnInit {
  profile: any;
  avatar: File;

  @Input()
  user: User;

  loading = false;

  group: Group = {
    groupId: 0, ownerId: '', name: '', summary: '', users: 0,
    zipCode: '', donation: 0, lat: 0, lng: 0, password: '', url: ''
  };

  constructor(
    private groupService: GroupService,
    private geohashService: GeohashService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private authService: AuthService,
    private fileService: FileService) { }

  ngOnInit() {
    if (this.authService.userProfile) {
      this.profile = this.authService.userProfile;
    } else {
      this.authService.getProfile((err, profile) => {
        this.profile = profile;
      });
    }

    this.group.ownerId = this.user.userId;
  }

  avatarChange(files: File[]) {
    this.avatar = files[0];
    this.uploadAvatar();
  }

  uploadAvatar() {
    const formData = new FormData();

    const arr = this.avatar.name.split('.');
    if (arr.length < 2) {
      swal('Image type doesn\'t support', '' , 'error');
      return;
    }
    if ( arr[arr.length - 1] !== 'png' && arr[arr.length - 1] !== 'jpg' &&
      arr[arr.length - 1] !== 'svg' && arr[arr.length - 1] !== 'gif') {
      swal('Image type doesn\'t support', '' , 'error');
      return;
    }

    formData.append('name', 'user-' + localStorage.getItem('user_id') + '.' + arr[arr.length - 1]);
    formData.append('file', this.avatar);

    this.fileService.uploadFile(formData)
      .then(res => {
         this.user.avatar = res.path;
         this.updateUser();
      });
  }

  onAddressChange() {
    this.loading = true;
    this.geohashService.getCoordinate(this.group.zipCode)
      .then((res) => {
        this.group.lat = res.lat;
        this.group.lng = res.lng;
        this.loading = false;
      });
  }


  updateUser() {
    this.userService.updateUser(this.user)
      .then(res => {
        swal('Changes saved', '', 'success');
      });
  }

  addGroup() {
    if (this.group.zipCode === '' || this.group.name === '') {
      swal('ZipCode or Name cannot be blank', '', 'error');
    } else {
      this.groupService.addGroup(this.group)
        .then((res) => {
          const user = {ownerId: this.group.ownerId, userId: this.user.userId, userName: this.user.name};
          this.groupService.addGroupUser(user)
            .then(() => {
              this.user.role = 'group';
              this.updateUser();
            });
        });
    }
  }
}
