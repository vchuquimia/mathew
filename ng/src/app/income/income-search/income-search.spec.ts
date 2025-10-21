import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSearch } from './income-search';

describe('IncomeSearch', () => {
  let component: IncomeSearch;
  let fixture: ComponentFixture<IncomeSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
