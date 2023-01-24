import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { LoaderService } from "@core/services/loader.service";

@Component({
  selector: "ui-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent {
  isLoading$: Observable<boolean> = this.loaderService.isLoading$ as Observable<boolean>;

  constructor(private loaderService: LoaderService) {
  }
}
