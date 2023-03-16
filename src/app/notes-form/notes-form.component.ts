import { DbService } from './../shared/dbservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Note } from '../shared/note';
import { Theme } from '../shared/theme';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ThemeValidator } from '../theme-list/theme-validator';

const regEx = new RegExp('^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$');

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

  constructor(private route: ActivatedRoute, private router: Router, private dbs: DbService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getThemes();

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
              theme: [this.note.theme?.description, Validators.required],
              text: [this.note.text, Validators.required]
            });
          })
          .catch(err => {/* Show Err in SnackBar and route to NotesList */});
      }
      else {
        console.log('err!!!');
        /* Show Err in Snackbar, give option to create new or go back to NotesList */
      }
    });

  }

  getThemes() {
    return this.dbs.getThemesByDescription()
      .then(themes => this.themes = themes)
      .catch(err => console.log(err))
  }

  routeToList(){
    this.router.navigate(['/notes/list/title']);
  }

  async updateAddNote(){
    Object.assign(this.note, this.noteForm.value);
    this.note.theme = await this.dbs.getThemeByDescription(this.noteForm.get('theme')!.value);
    if(this.id == 'new')
      this.dbs.addNote(this.note);
    else
      this.dbs.updateNote(this.note);
  }

  openThemeDialog(theme: Theme) {
    const dialogRef = this.dialog.open(ThemeDialogComponent, {
      data: { descr: theme.description },
      height: '235px',
    });

    dialogRef.afterClosed().subscribe((descr) => {
      if (descr != undefined && descr != '') {
        theme.description = descr;
        this.dbs.addTheme(theme).then(_ => {
          this.getThemes().then(_ => this.noteForm.get('theme')?.setValue(theme.description));
        });
      }
    });

  }

  getNewTheme() {
    return Theme.empty();
  }
}

@Component({
  selector: 'uv-theme-dialog-note',
  templateUrl: './theme-dialog.component.html',
})
export class ThemeDialogComponent implements OnInit{
  descriptionControl!: FormControl;
  ogText!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { descr: string },
    public dialogRef: MatDialogRef<ThemeDialogComponent>,
    private dbs: DbService
  ) {}

  ngOnInit(): void {
    this.descriptionControl = new FormControl(this.data.descr, Validators.required, ThemeValidator.descrExists(this.dbs));
    this.ogText = this.data.descr;
  }

  closeDialog(descr: string) {
    this.dialogRef.close(descr);
  }
}
