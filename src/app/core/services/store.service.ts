import { Injectable } from '@angular/core';
import { Person } from "@shared/interfaces";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private savedSearchValue: Person | null = null;
  private bookmarks: Person[] = [];

  constructor(
    private toastrService: ToastrService
  ) {
    this.initSavedSearchValue();
    this.initBookmarks();
  }

  saveSearchValue(value: Person) {
    localStorage.setItem('savedSearchValue', JSON.stringify(value));

    this.savedSearchValue = value;
  }

  getSavedSearchValue(): Person | null {
    return this.savedSearchValue;
  }

  saveBookmark(value: Person) {
    localStorage.setItem('bookmarks', JSON.stringify([...this.bookmarks, value]));

    this.bookmarks?.push(value);

    this.toastrService.success('Bookmark added');
  }

  removeBookmark(value: Person) {
    const bookmarks = this.bookmarks.filter(bookmark => bookmark.name !== value.name)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    this.bookmarks = bookmarks;

    this.toastrService.success('Bookmark removed');
  }

  getBookmarks(): Person[] {
    return this.bookmarks;
  }

  private initSavedSearchValue() {
    const savedSearchValue = localStorage.getItem('savedSearchValue')

    if (typeof savedSearchValue === 'string') {
      this.savedSearchValue = JSON.parse(savedSearchValue);
    }
  }

  private initBookmarks() {
    const bookmarks = localStorage.getItem('bookmarks')

    if (typeof bookmarks === 'string') {
      this.bookmarks = JSON.parse(bookmarks);
    }
  }
}
