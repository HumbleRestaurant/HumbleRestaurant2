import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingReceiptComponent } from './setting-receipt.component';

describe('SettingReceiptComponent', () => {
  let component: SettingReceiptComponent;
  let fixture: ComponentFixture<SettingReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
