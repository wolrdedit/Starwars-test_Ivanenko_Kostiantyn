import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotifyService {
  constructor(private toastrService: ToastrService) {
  }

  success(msg: string) {
    this.toastrService.success(msg, "Success");
  }

  infoLong(msg: string) {
    this.toastrService.info(msg, "Please note", {
      timeOut: 6000,
    });
  }

  infoShort(msg: string) {
    this.toastrService.info(msg, "Please note");
  }

  failureLong(msg: string) {
    this.toastrService.error(msg, "Ooops...", {
      timeOut: 6000,
    });
  }

  failureShort(msg: string) {
    this.toastrService.error(msg, "Ooops...");
  }
}
