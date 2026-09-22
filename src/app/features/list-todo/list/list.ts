import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService, Todo } from '../../../core/services/api.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  readonly produtos = signal<Todo[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly feedback = signal('');
  readonly menuAberto = signal(false);
  readonly modoMenu = signal<'create' | 'update' | 'delete'>('create');

  readonly tituloMenu = computed(() => {
    if (this.modoMenu() === 'create') {
      return 'Criar produto';
    }

    if (this.modoMenu() === 'update') {
      return 'Atualizar produto';
    }

    return 'Excluir produto';
  });

  readonly createForm = this.fb.nonNullable.group({
    userId: [1, [Validators.required, Validators.min(1)]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    completed: [false],
  });

  readonly updateForm = this.fb.nonNullable.group({
    id: [1, [Validators.required, Validators.min(1)]],
    userId: [1, [Validators.required, Validators.min(1)]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    completed: [false],
  });

  readonly deleteForm = this.fb.nonNullable.group({
    id: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.api.buscar().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos.slice(0, 20));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Nao foi possivel carregar os produtos.');
        this.carregando.set(false);
      },
    });
  }

  abrirMenu(modo: 'create' | 'update' | 'delete', produto?: Todo): void {
    this.feedback.set('');
    this.modoMenu.set(modo);
    this.menuAberto.set(true);

    if (modo === 'update' && produto?.id) {
      this.updateForm.setValue({
        id: produto.id,
        userId: produto.userId,
        title: produto.title,
        completed: produto.completed,
      });
    }

    if (modo === 'delete' && produto?.id) {
      this.deleteForm.setValue({ id: produto.id });
    }
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
    this.feedback.set('');
  }

  criarProduto(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.getRawValue();
    this.api.criar(payload).subscribe({
      next: (novoProduto) => {
        this.produtos.update((lista) => [novoProduto, ...lista]);
        this.feedback.set('Produto criado com sucesso.');
        this.createForm.reset({ userId: 1, title: '', completed: false });
      },
      error: () => {
        this.feedback.set('Falha ao criar produto.');
      },
    });
  }

  atualizarProduto(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const formValue = this.updateForm.getRawValue();
    this.api
      .atualizar(formValue.id, {
        userId: formValue.userId,
        title: formValue.title,
        completed: formValue.completed,
      })
      .subscribe({
        next: (produtoAtualizado) => {
          this.produtos.update((lista) =>
            lista.map((item) =>
              item.id === formValue.id
                ? { ...produtoAtualizado, id: formValue.id }
                : item,
            ),
          );
          this.feedback.set('Produto atualizado com sucesso.');
        },
        error: () => {
          this.feedback.set('Falha ao atualizar produto.');
        },
      });
  }

  excluirProduto(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const { id } = this.deleteForm.getRawValue();
    this.api.deletar(id).subscribe({
      next: () => {
        this.produtos.update((lista) => lista.filter((item) => item.id !== id));
        this.feedback.set('Produto removido com sucesso.');
      },
      error: () => {
        this.feedback.set('Falha ao remover produto.');
      },
    });
  }
}
