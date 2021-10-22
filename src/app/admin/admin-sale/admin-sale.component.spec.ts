import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSaleComponent } from './admin-sale.component';

describe('AdminSaleComponent', () => {
  let component: AdminSaleComponent;
  let fixture: ComponentFixture<AdminSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
