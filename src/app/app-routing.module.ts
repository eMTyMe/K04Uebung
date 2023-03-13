import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { ThemeListComponent } from './theme-list/theme-list.component';

const routes: Routes = [
  {path: '', redirectTo: '/notes/title', pathMatch: 'full'},
  {path: 'notes/:sort', component: NoteListComponent},
  {path: 'themes', component: ThemeListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
