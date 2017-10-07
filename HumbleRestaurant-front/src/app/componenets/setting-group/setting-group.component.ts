import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../models/User.model';
import {GroupService} from '../../services/group/group.service';
import {Group} from '../../models/Group';
import {GeohashService} from '../../services/geohash/geohash.service';
import swal from 'sweetalert';
import {FileService} from '../../services/file/file.service';

@Component({
  selector: 'app-setting-group',
  templateUrl: './setting-group.component.html',
  styleUrls: ['./setting-group.component.css']
})
export class SettingGroupComponent implements OnInit, OnChanges {
  @Input()
  user: User;

  group: Group;
  groupUsers;

  loading = false;

  constructor(
    private fileService: FileService,
    private geohashService: GeohashService,
    private groupService: GroupService) { }

  ngOnInit() {
    this.groupService.getGroup(this.user.userId)
      .then( group => {
        this.group = group;
        this.getGroupUsers();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.groupService.getGroup(this.user.userId)
      .then( group => {
        this.group = group;
        this.getGroupUsers();
      });
  }

  getGroupUsers() {
    this.groupService.getGroupUsers(this.group.ownerId)
      .then(groupUsers => this.groupUsers = groupUsers);
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

  updateGroup() {
    if (!this.group.name || !this.group.zipCode) {
      swal('Name or ZipCode cannot be empty', '', 'error');
    }

    this.groupService.updateGroup(this.group)
      .then(res => {
        swal('Changes saved', '', 'success');
      });
  }

  deleteGroupUser(userId: string) {
    this.groupService.deleteGroupUser(this.group.ownerId, userId)
      .then(res => {
        this.getGroupUsers();
        swal('Changes saved', '', 'success');
      });
  }


  avatarChange(files: File[]) {
    const formData = new FormData();

    const arr = files[0].name.split('.');
    if (arr.length < 2) {
      swal('Image type doesn\'t support', '' , 'error');
      return;
    }
    if ( arr[arr.length - 1] !== 'png' && arr[arr.length - 1] !== 'jpg' &&
      arr[arr.length - 1] !== 'svg' && arr[arr.length - 1] !== 'gif') {
      swal('Image type doesn\'t support', '' , 'error');
      return;
    }

    formData.append('name', 'group-' + this.group.ownerId + '.' + arr[arr.length - 1]);
    formData.append('file', files[0]);

    this.fileService.uploadFile(formData)
      .then(res => {
        this.group.url = res.path;
        this.updateGroup();
      });
  }
}
