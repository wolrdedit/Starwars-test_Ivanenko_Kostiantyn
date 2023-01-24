export interface StarshipResponse extends Starship {
}

export interface Starship {
  name: string;
  model: string;
  cost_in_credits: string;
}
