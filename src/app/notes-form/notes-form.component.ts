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
import { MatSnackBar } from '@angular/material/snack-bar';

/* RegExp for ID control */
const regEx = new RegExp('^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$');

@Component({
  selector: 'uv-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.scss']
})
export class NotesFormComponent implements OnInit {

  /* Previous sortOrder of Notes-List for callback */
  prevSortOrder!: string;
  /* Themes for Theme Mat-Select */
  themes!: Theme[]
  /* FormControl */
  noteForm!: FormGroup;
  /* Either selected note or new note */
  note!: Note;
  /* ID passed from route; in normal case either string matching RegExp TmplAstBoundEvent, or 'new' */
  id!: string;
  /* error if ID was neither found nor 'new' */
  err: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private dbs: DbService, private fb: FormBuilder, private dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.prevSortOrder = this.route.snapshot.params['sO'];

    this.getThemes();

    this.route.params.subscribe(params => {
      if(!params.id)
        this.router.navigate(['/notes/form/new']);
      this.id = params.id;
      /* prepare form for new entry */
      if(this.id == 'new'){
        this.note = Note.empty();
        this.noteForm = this.fb.group({
          title: [this.note.title, Validators.required],
          theme: [this.note.theme, Validators.required],
          text: [this.note.text, Validators.required]
        });
      }
      /* prepare form for editing note */
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
        /* Show Err in Snackbar, give option to create new or go back to NotesList */
        this.err = true;
        const snackBarRef = this._snackBar.open('Keine Notiz mit ID "'+this.id+'" gefunden\nWollen Sie eine neue Notiz anlegen?', 'Neue Notiz',
          {panelClass: ["snack-bar-red", "snack-bar"], duration: 5000});
        snackBarRef.onAction().subscribe(() => this.router.navigate(['/notes/form/new']));
      }
    });

  }

  getThemes() {
    return this.dbs.getThemesByDescription()
      .then(themes => this.themes = themes)
      .catch(err => console.log(err))
  }

  routeToList(){
    if(this.prevSortOrder != undefined)
      this.router.navigate(['/notes/list/'+this.prevSortOrder]);
    else
      this.router.navigate(['/notes/list/title']);

  }

  async updateAddNote(){
    Object.assign(this.note, this.noteForm.value);
    this.note.theme = await this.dbs.getThemeByDescription(this.noteForm.get('theme')!.value);
    if(this.id == 'new')
      this.dbs.addNote(this.note)
        .then(_ => {
          this._snackBar.open('Notiz erfolgreich hinzugefügt', 'Ok', {panelClass: ["snack-bar-green", "snack-bar"], duration: 4000});
          this.routeToList();
        })
        .catch(err => {
          console.log(err);
          this._snackBar.open('Fehler beim eintragen der Notiz in die Datenbank', 'Ok', {panelClass: ["snack-bar-red", "snack-bar"], duration: 4000});
        })
    else
      this.dbs.updateNote(this.note)
      .then(_ => {
        this._snackBar.open('Notiz erfolgreich geändert', 'Ok', {panelClass: ["snack-bar-green", "snack-bar"], duration: 4000});
      })
      .catch(err => {
        console.log(err);
        this._snackBar.open('Fehler beim ändern der Notiz in der Datenbank', 'Ok', {panelClass: ["snack-bar-red", "snack-bar"], duration: 4000});
      });
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

  deleteNote() {
    if(this.id != 'new' && this.id != null && this.id != undefined) {
      this.dbs.getNoteByID(this.id)
        .then(note => this.dbs.deleteNote(note)
          .then(_ => {
            this._snackBar.open('Notiz erfolgreich gelöscht', 'Ok', {panelClass: ["snack-bar-green", "snack-bar"], duration: 4000});
            this.routeToList();
          }))
        .catch(err => {
          console.log(err);
          this._snackBar.open('Löschen der Notiz in der Datenbank fehlgeschlagen', 'Ok', {panelClass: ["snack-bar-red", "snack-bar"], duration: 4000});
        });
    }
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
    this.ogText = this.data.descr;
    this.descriptionControl = new FormControl(this.data.descr, Validators.required, ThemeValidator.descrExists(this.dbs));
  }

  closeDialog(descr: string) {
    this.dialogRef.close(descr);
  }
}
