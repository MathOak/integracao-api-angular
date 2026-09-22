import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Todo } from '../../../core/services/api.service';

type CardAction = 'update' | 'delete';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly todo = input.required<Todo>();
  readonly acaoSelecionada = output<{ modo: CardAction; todo: Todo }>();

  abrirMenu(modo: CardAction): void {
    this.acaoSelecionada.emit({ modo, todo: this.todo() });
  }
}
