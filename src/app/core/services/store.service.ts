import { Injectable } from '@angular/core';
import { Person } from "@shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  savedValue: Person | null = null;

  constructor() {
    const savedValue = localStorage.getItem('savedValue')

    if (typeof savedValue === 'string') {
      this.savedValue = JSON.parse(savedValue);
    }
  }

  saveValue(value: Person) {
    localStorage.setItem('savedValue', JSON.stringify(value));

    this.savedValue = value;
  }

  getSavedValue(): Person | null {
    return this.savedValue;
  }
}
