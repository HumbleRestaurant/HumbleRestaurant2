import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDonorComponent } from './setting-donor.component';

describe('SettingDonorComponent', () => {
  let component: SettingDonorComponent;
  let fixture: ComponentFixture<SettingDonorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingDonorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
