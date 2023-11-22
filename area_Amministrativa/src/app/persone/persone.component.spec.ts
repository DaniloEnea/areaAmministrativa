import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoneComponent } from './persone.component';

describe('PersoneComponent', () => {
  let component: PersoneComponent;
  let fixture: ComponentFixture<PersoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
