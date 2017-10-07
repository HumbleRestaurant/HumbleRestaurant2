import { Component, OnInit } from '@angular/core';
import {Group} from '../../models/Group';
import {GroupService} from '../../services/group/group.service';
import {User} from '../../models/User.model';

@Component({
  selector: 'app-setting-groups',
  templateUrl: './setting-groups.component.html',
  styleUrls: ['./setting-groups.component.css']
})
export class SettingGroupsComponent implements OnInit {

  groups: Group[] = [];
  page: number;
  keyword: string;

  selected: User;

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.keyword = null;
    this.page = 1;
    this.searchGroup();
  }

  searchGroup() {
    this.groupService.searchGroups({keyword: this.keyword, page: this.page, sortBy: 'donation'})
      .then(res => this.groups = res);
  }

  setCurGroup(ownerId) {
    this.selected = new User();
    this.selected.userId = ownerId;
  }

  jumpPage(num: number) {
    this.page += num;
    if (this.page <= 0) {
      this.page = 1;
    }

    this.searchGroup();
  }
}
