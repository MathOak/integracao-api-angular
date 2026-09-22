import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Todo {
  userId: number;
  id?: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private url = 'https://jsonplaceholder.typicode.com';

  buscar() {
    return this.http.get<Todo[]>(`${this.url}/todos`);
  }

  criar(body: Omit<Todo, 'id'>) {
    return this.http.post<Todo>(`${this.url}/todos`, body);
  }

  atualizar(id: number, body: Omit<Todo, 'id'>) {
    return this.http.put<Todo>(`${this.url}/todos/${id}`, body);
  }
  atualizarParcial(id: number, body: Partial<Todo>) {
    return this.http.patch<Todo>(`${this.url}/todos/${id}`, body);
  }
  deletar(id: number) {
    return this.http.delete(`${this.url}/todos/${id}`);
  }
}
