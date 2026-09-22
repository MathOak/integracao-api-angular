import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./features/list-todo/list/list').then((m) => m.List),
	},
];
