import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDetail } from './resume-detail';

describe('ResumeDetail', () => {
  let component: ResumeDetail;
  let fixture: ComponentFixture<ResumeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
