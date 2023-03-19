import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uv-notesnavbar',
  templateUrl: './notesnavbar.component.html',
  styleUrls: ['./notesnavbar.component.scss']
})
export class NotesnavbarComponent implements OnInit {

  sortOrder!: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(!params.sortOrder)
        this.router.navigate(['/notes/list/title'])
      this.sortOrder = params.sortOrder;
    })
  }

}
