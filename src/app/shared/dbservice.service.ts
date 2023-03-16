import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { Note } from './note';
import { Theme } from './theme';
import { User } from './user';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  private notes!: Dexie.Table<Note, string>;
  private themes!: Dexie.Table<Theme, string>;
  constructor() {
    super('notes-db');
    this.version(1).stores({
      notes:
        'id, title, [theme.description+title], theme.id, [modificationDate+creationDate]',
      themes: 'id, &description',
    });
    this.on('populate', async () => {
      try {
        const t1 = new Theme(uuidv4(), 'Bananen');
        const t2 = new Theme(uuidv4(), 'Birnen');
        const t3 = new Theme(uuidv4(), 'Ananas');
        await this.themes.bulkAdd([t1, t2, t3]);
        const u = new User('sepp@hintner.com', 'sepp');
        const n1 = new Note(
          uuidv4(),
          'Titel1',
          'Text1',
          moment().valueOf(),
          0,
          t2,
          u,
          false
        );
        const n2 = new Note(
          uuidv4(),
          'Titel2',
          'Text2',
          moment().valueOf(),
          0,
          t1,
          u,
          false
        );
        await this.addNote(n1);
        await this.addNote(n2);
      } catch (err) {
        console.log(err);
      }
    });
  }
  async getThemesByDescription() {
    return this.themes.orderBy('description').toArray();
  }
  async getThemeByDescription(description: string) {
    const theme = await this.themes
      .where('description')
      .equals(description)
      .first();
    return theme ? theme : Promise.reject('Theme not found');
  }

  async getNotesBySort(sortOrder: string){
    switch(sortOrder){
      case 'theme':
        return this.notes.orderBy('[theme.description+title]').toArray();
      case 'date':
        return this.notes.orderBy('[modificationDate+creationDate]').toArray();
      case 'title':
      default:
        return this.notes.orderBy('title').toArray();
    }
  }

  async getNoteByID(id: string){
    const note = await this.notes.where('id').equals(id).first();
    return note ? note : Promise.reject('Note not found');
  }

  async getNotesByTheme() {
    return this.notes.orderBy('[theme.description+title]').reverse().toArray();
  }
  async getNotes(description: string) {
    return this.notes
      .where('theme.description')
      .equals(description)
      .sortBy('title');
  }
  async addTheme(theme: Theme) {
    return this.themes.add(theme);
  }
  async deleteTheme(theme: Theme) {
    const notes = await this.getNotes(theme.description);
    return notes.length
      ? Promise.reject('Theme in use')
      : this.themes.delete(theme.id);
  }
  async updateTheme(theme: Theme) {
    await this.themes.update(theme.id, theme);
    return this.notes.where('theme.id').equals(theme.id).modify({
      'theme.description': theme.description,
      modificationDate: moment().valueOf(),
    });
  }
  async addNote(note: Note) {
    note.creationDate = moment().valueOf();
    note.modificationDate = 0;
    return this.notes.add(note);
  }

  checkThemeExists(description: string): Observable<Theme | undefined> {
    return from(
      this.themes
        .where('description')
        .equals(description)
        .first()
    );
  }

  async updateNote(note: Note) {
    note.modificationDate = moment().valueOf();
    this.notes.update(note.id, note);
  }
}
