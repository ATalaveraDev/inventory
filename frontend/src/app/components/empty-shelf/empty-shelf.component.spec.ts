import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyShelfComponent } from './empty-shelf.component';

describe('EmptyShelfComponent', () => {
  let component: EmptyShelfComponent;
  let fixture: ComponentFixture<EmptyShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
