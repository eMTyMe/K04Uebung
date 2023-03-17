import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uv-notesnavbar',
  templateUrl: './notesnavbar.component.html',
  styleUrls: ['./notesnavbar.component.scss']
})
export class NotesnavbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {}

}
