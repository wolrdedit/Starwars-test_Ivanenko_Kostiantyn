import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
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
  tap,
  toArray
} from "rxjs";
import { PeopleService } from "@core/services/people.service";
import { Person, Starship } from "@shared/interfaces";

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss']
})
export class StarshipsComponent implements OnInit, OnDestroy {
  readonly destroyer$ = new Subject<void>();
  readonly peopleControl = new FormControl<string | Person>('');
  filteredPeople$!: Observable<Person[]>;
  starships$: Observable<Starship[] | null> = new Observable<Starship[] | null>();

  displayedColumns: string[] = ['name', 'model', 'cost_in_credits'];

  constructor(
    private peopleService: PeopleService
  ) {
  }

  ngOnInit() {
    this.filteredPeople$ = this.peopleControl.valueChanges
      .pipe(
        takeUntil(this.destroyer$),
        startWith(''),
        tap(() => this.starships$ = of(null)),
        debounceTime(1000),
        switchMap((value) => {
          if (typeof value === 'string') {
            return this.getPeople(value || '')
          }

          return of([]);
        }),
      );
  }

  ngOnDestroy(): void {
    this.destroyer$.next();
    this.destroyer$.unsubscribe();
  }

  getStarships(person: Person) {
    this.starships$ = from(person.starships)
      .pipe(
        mergeMap(url => {
          return this.peopleService.getStarship(url)
        }),
        toArray()
      )
  }

  displayName(option: Person | null) {
    return option ? option.name : '';
  }

  trackByIdFn(index: number) {
    return index;
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
}
