import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { debounceTime, from, map, mergeMap, Observable, startWith, Subject, switchMap, takeUntil, toArray } from "rxjs";
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
  readonly peopleControl = new FormControl<string | Person | null>(null);
  filteredPeople$!: Observable<Person[]>;
  starships$: Observable<Starship[] | null> = new Observable<Starship[] | null>();

  displayedColumns: string[] = ['name', 'model', 'cost_in_credits'];

  constructor(
    private peopleService: PeopleService,
    private storeService: StoreService,
  ) {
  }

  ngOnInit() {
    this.getSavedData();

    this.filteredPeople$ = this.peopleControl.valueChanges
      .pipe(
        takeUntil(this.destroyer$),
        startWith(''),
        debounceTime(500),
        switchMap((value) => {
          if (typeof value === 'string') {
            return this.getPeople(value || '')
          }

          return this.filteredPeople$;
        }),
      );
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
          console.log(url)
          return this.peopleService.getStarship(url)
        }),
        toArray(),
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

  private getSavedData() {
    const savedData = this.storeService.getSavedValue();

    if (savedData) {
      this.peopleControl.setValue(savedData);
      this.getStarships(savedData);
    }
  }

  private saveSearchData(person: Person) {
    this.storeService.saveValue(person);
  }
}
