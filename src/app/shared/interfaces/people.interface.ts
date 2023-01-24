export interface PeopleResponse {
  results: Person[];
}

export interface Person {
  name: string;
  starships: string[];
}
