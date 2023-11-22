import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizzazioneComponent } from './organizzazione.component';

describe('OrganizzazioneComponent', () => {
  let component: OrganizzazioneComponent;
  let fixture: ComponentFixture<OrganizzazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizzazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizzazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
