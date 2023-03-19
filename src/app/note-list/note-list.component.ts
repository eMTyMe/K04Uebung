import { DbService } from './../shared/dbservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Note } from '../shared/note';

@Component({
  selector: 'uv-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {

  sortOrder!: string;
  notes!: Note[];

  constructor(private route: ActivatedRoute, private dbs: DbService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.sortOrder = params.sortOrder;
      this.dbs.getNotesBySort(params.sortOrder).then(notes => this.notes = notes);
    });
  }

  redirectToForm(id: string){
    this.router.navigate(['/notes/form/'+id, {sO: this.sortOrder}]);
  }
}
