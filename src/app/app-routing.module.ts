import { NotesFormComponent } from './notes-form/notes-form.component';
import { NotesnavbarComponent } from './notesnavbar/notesnavbar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { ThemeListComponent } from './theme-list/theme-list.component';

const routes: Routes = [
  {path: '', redirectTo: '/notes/list/title', pathMatch: 'full'},
  {path: 'themes', component: ThemeListComponent},
  {path: 'notes', component: NotesnavbarComponent,
    children: [
      {path: 'form', component: NotesFormComponent},
      {path: 'form/:id', component: NotesFormComponent},
      {path: 'list/:sortOrder', component: NoteListComponent},
      {path: '', redirectTo: '/notes/list/title', pathMatch: 'full'}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
