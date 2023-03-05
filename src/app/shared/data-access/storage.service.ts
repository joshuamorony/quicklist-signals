import { inject, Injectable, InjectionToken, PLATFORM_ID } from "@angular/core";
import { Checklist } from "../interfaces/checklist";
import { ChecklistItem } from "../interfaces/checklist-item";

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  "window local storage object",
  {
    providedIn: "root",
    factory: () => {
      return inject(PLATFORM_ID) === "browser"
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: "root",
})
export class StorageService {
  #checklistHasLoaded = false;
  #checklistItemsHasLoaded = false;

  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    this.#checklistHasLoaded = true;
    const checklists = this.storage.getItem("checklists");
    return checklists ? JSON.parse(checklists) : [];
  }

  loadChecklistItems() {
    this.#checklistItemsHasLoaded = true;
    const checklists = this.storage.getItem("checklistItems");
    return checklists ? JSON.parse(checklists) : [];
  }

  saveChecklists(checklists: Checklist[]) {
    if (this.#checklistHasLoaded) {
      this.storage.setItem("checklists", JSON.stringify(checklists));
    }
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    if (this.#checklistItemsHasLoaded) {
      this.storage.setItem("checklistItems", JSON.stringify(checklistItems));
    }
  }
}
