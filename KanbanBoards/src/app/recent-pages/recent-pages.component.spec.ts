import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPagesComponent } from './recent-pages.component';

describe('RecentPagesComponent', () => {
  let component: RecentPagesComponent;
  let fixture: ComponentFixture<RecentPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
