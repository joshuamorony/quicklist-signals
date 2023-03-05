import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ChecklistItemService } from "./checklist/data-access/checklist-item.service";
import { ChecklistService } from "./shared/data-access/checklist.service";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: "app-root",
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {

  constructor(private checklistService: ChecklistService, private checklistItemService: ChecklistItemService){}

  ngOnInit(){
    this.checklistService.load();
    this.checklistItemService.load();
  }
}
