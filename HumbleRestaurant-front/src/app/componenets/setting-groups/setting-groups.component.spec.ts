import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingGroupsComponent } from './setting-groups.component';

describe('SettingGroupsComponent', () => {
  let component: SettingGroupsComponent;
  let fixture: ComponentFixture<SettingGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
