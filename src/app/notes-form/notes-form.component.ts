import { DbService } from './../shared/dbservice.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Note } from '../shared/note';
import { Theme } from '../shared/theme';

const regEx = new RegExp('^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$');

@Component({
  selector: 'uv-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.scss']
})
export class NotesFormComponent implements OnInit {

  themes!: Theme[]
  noteForm!: FormGroup;
  note!: Note;
  id!: string;

  constructor(private route: ActivatedRoute, private dbs: DbService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dbs.getThemesByDescription()
      .then(themes => this.themes = themes)
      .catch(err => console.log(err))

    this.route.params.subscribe(params => {
      this.id = params.id;
      if(this.id == 'new'){
        this.note = Note.empty();
        this.noteForm = this.fb.group({
          title: [this.note.title, Validators.required],
          theme: [this.note.theme, Validators.required],
          text: [this.note.text, Validators.required]
        });
      }
      else if(regEx.test(this.id)){
        this.dbs.getNoteByID(this.id)
          .then(note => {
            this.note = note;
            this.noteForm = this.fb.group({
              title: [this.note.title, Validators.required],
              theme: [this.note.theme, Validators.required],
              text: [this.note.text, Validators.required]
            });
          })
          .catch(err => {/* Show Err in SnackBar and route to NotesList */});
      }
      else {
        console.log('err!!!');
        /* Show Err in Snackbar, give option to create new or go back to NotesList */
      }
      console.log('note: '+this.note);
      console.log('noteForm: '+this.noteForm);
      console.log('themes: '+this.themes);
    });

  }

}
