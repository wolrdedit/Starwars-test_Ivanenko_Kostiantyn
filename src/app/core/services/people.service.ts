import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
import { PeopleResponse } from "@shared/interfaces/people.interface";
import { StarshipResponse } from "@shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getPeople(name?: string): Observable<PeopleResponse> {
    let params = new HttpParams();
    if (name) params = params = params.append("search", name);

    return this.httpClient.get<PeopleResponse>(`${environment.API_URL}/people`, {params});
  }

  getStarship(url: string): Observable<StarshipResponse> {
    return this.httpClient.get<StarshipResponse>(`${url}`);
  }
}
