import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {
  debounceTime,
  from,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  toArray
} from "rxjs";
import { PeopleService } from "@core/services/people.service";
import { Person, Starship } from "@shared/interfaces";
import { StoreService } from "@core/services/store.service";

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss']
})
export class StarshipsComponent implements OnInit, OnDestroy {
  readonly destroyer$ = new Subject<void>();
  readonly formGroup = new FormGroup({
    people: new FormControl<string | Person | null>(''),
    bookmarks: new FormControl<Person | null>(null),
  });
  filteredPeople$!: Observable<Person[]>;
  starships$: Observable<Starship[] | null> = new Observable<Starship[] | null>();

  displayedColumns: string[] = ['name', 'model', 'cost_in_credits'];

  get peopleControl() {
    return this.formGroup.get('people');
  }

  get bookmarkControl() {
    return this.formGroup.get('bookmarks');
  }

  constructor(
    private peopleService: PeopleService,
    public storeService: StoreService,
  ) {
  }

  ngOnInit() {
    this.getSavedData();

    this.filteredPeople$ = this.peopleControl!.valueChanges
      .pipe(
        takeUntil(this.destroyer$),
        startWith(''),
        debounceTime(500),
        switchMap((value) => {
          if (typeof value === 'string') {
            return this.getPeople(value || '')
          }

          return of([]);
        }),
      );

    this.bookmarkControl?.valueChanges
      .pipe(
        takeUntil(this.destroyer$),
      )
      .subscribe(value => {
        if (value) {
          this.getStarships(value);
          this.peopleControl!.setValue(value);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroyer$.next();
    this.destroyer$.unsubscribe();
  }

  getStarships(person: Person) {
    this.saveSearchData(person);

    this.starships$ = from(person.starships)
      .pipe(
        mergeMap(url => {
          return this.peopleService.getStarship(url)
        }),
        toArray(),
      )

    const foundPerson = this.findBookmarkedPerson(person);

    if (foundPerson) {
      this.bookmarkControl?.setValue(foundPerson, {emitEvent: false});
    } else {
      this.bookmarkControl?.reset();
    }
  }

  toggleBookmark() {
    const person = this.peopleControl!.value as Person;
    const foundPerson = this.findBookmarkedPerson(person);

    if (foundPerson) {
      this.bookmarkControl?.reset();
      this.storeService.removeBookmark(person);
    } else {
      this.bookmarkControl?.setValue(person, {emitEvent: false});
      this.storeService.saveBookmark(person);
    }
  }

  displayName(option: Person | null) {
    return option ? option.name : '';
  }

  trackByIdFn(index: number) {
    return index;
  }

  isPersonBookmarked(): boolean {
    const bookmark = this.bookmarkControl?.value as Person
    return !!this.storeService.getBookmarks().find(foundBookmark => foundBookmark.name === bookmark?.name);
  }

  private findBookmarkedPerson(person: Person): Person | undefined {
    return this.storeService.getBookmarks().find(bookmark => bookmark.name === person.name);
  }

  private getPeople(name: string): Observable<Person[]> {
    return this.peopleService
      .getPeople(name)
      .pipe(
        map(
          people => {
            return people.results;
          }
        ));
  }

  private getSavedData() {
    const savedData = this.storeService.getSavedSearchValue();

    if (savedData) {
      this.peopleControl!.setValue(savedData);
      this.getStarships(savedData);
    }
  }

  private saveSearchData(person: Person) {
    this.storeService.saveSearchValue(person);
  }
}
