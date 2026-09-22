import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { List } from './list';
import { ApiService } from '../../../core/services/api.service';

const apiMock: Pick<ApiService, 'buscar' | 'criar' | 'atualizar' | 'deletar'> = {
  buscar: () => of([]),
  criar: () => of({ id: 101, userId: 1, title: 'novo', completed: false }),
  atualizar: () => of({ id: 1, userId: 1, title: 'atualizado', completed: true }),
  deletar: () => of({}),
};

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [{ provide: ApiService, useValue: apiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
