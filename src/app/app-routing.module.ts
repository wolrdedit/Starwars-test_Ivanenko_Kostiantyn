import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    redirectTo: "starships",
    pathMatch: "full",
  },
  {
    path: 'starships',
    loadChildren: () => import("@features/starships/starships.module").then(m => m.StarshipsModule),
  },
  {
    path: "**",
    redirectTo: "starships",
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
