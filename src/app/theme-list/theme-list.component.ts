import { Component, OnInit, Inject} from '@angular/core';
import { DbService } from '../shared/dbservice.service';
import { Theme } from '../shared/theme';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ThemeValidator } from './theme-validator';

@Component({
  selector: 'uv-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss'],
})
export class ThemeListComponent implements OnInit {
  themes!: Theme[];

  constructor(private dbs: DbService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getThemes();
  }

  openThemeDialog(theme: Theme) {
    const newTheme = theme.description == '';
    if (newTheme) theme = Theme.empty();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { descr: theme?.description },
      height: '235px'
    });

    dialogRef.afterClosed().subscribe((descr) => {
      if (descr != undefined && descr != '' && descr != 'del:true') {
        theme.description = descr;
        if (newTheme) {
          this.dbs.addTheme(theme).then((_) => this.getThemes());
        } else {
          this.dbs.updateTheme(theme).then((_) => this.getThemes());
        }
      } else if (descr == 'del:true') {
        if (!newTheme)
          this.dbs
            .deleteTheme(theme)
            .then((_) => this.getThemes())
            .catch((err) => console.log(err));
      }
    });
  }

  getThemes() {
    this.dbs
      .getThemesByDescription()
      .then((themes) => (this.themes = themes))
      .catch((err) => console.log(err));
  }

  getNewTheme() {
    return Theme.empty();
  }

  deleteTheme(theme: Theme) {
    this.dbs.deleteTheme(theme);
  }
}

@Component({
  selector: 'uv-theme-dialog',
  templateUrl: './theme-dialog.component.html',
})
export class DialogComponent implements OnInit{
  descriptionControl!: FormControl;
  ogText!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { descr: string },
    public dialogRef: MatDialogRef<DialogComponent>,
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
