import { Component, OnInit } from '@angular/core';
import { DbService } from '../shared/dbservice.service';
import { Theme } from '../shared/theme';

@Component({
  selector: 'uv-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {

  themes!: Theme[];

  constructor(private dbs: DbService) { }

  ngOnInit(): void {
    this.dbs.getThemesByDescription()
    .then(themes => this.themes = themes)
    .catch(err => console.log(err));
  }

}
