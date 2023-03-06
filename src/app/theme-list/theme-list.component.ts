import { Component, OnInit, Inject } from '@angular/core';
import { DbService } from '../shared/dbservice.service';
import { Theme } from '../shared/theme';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'uv-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {

  themes!: Theme[];

  constructor(private dbs: DbService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dbs.getThemesByDescription()
    .then(themes => this.themes = themes)
    .catch(err => console.log(err));
  }

  openThemeDialog(theme: Theme) {
    /* this.dialog.open(); */
  }

}

@Component({
  selector: 'uv-theme-dialog',
  templateUrl: './theme-dialog.component.html'
})
export class DialogComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public themeDescr: string) {}

  descriptionControl = new FormControl('', Validators.required);
}
