import { Injectable, signal, effect, computed } from "@angular/core";
import { StorageService } from "../../shared/data-access/storage.service";
import {
  AddChecklistItem,
  ChecklistItem,
} from "../../shared/interfaces/checklist-item";

@Injectable({
  providedIn: "root",
})
export class ChecklistItemService {
  private checklistItems = signal<ChecklistItem[]>([]);

  constructor(private storageService: StorageService) {}

  load() {
    const checklistItems = this.storageService.loadChecklistItems();
    this.checklistItems.set(checklistItems);

    effect(() => {
      this.storageService.saveChecklistItems(this.checklistItems());
    });
  }

  getItemsByChecklistId(checklistId: string) {
    return computed(() =>
      this.checklistItems().filter((item) => item.checklistId === checklistId)
    );
  }

  reset(checklistId: string) {
    this.checklistItems.update((items) =>
      items.map((item) =>
        item.checklistId === checklistId ? { ...item, checked: false } : item
      )
    );
  }

  toggle(itemId: string) {
    this.checklistItems.update((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  }

  add(item: AddChecklistItem, checklistId: string) {
    const newItem = {
      id: Date.now().toString(),
      checklistId,
      checked: false,
      ...item,
    };

    this.checklistItems.mutate((checklistItems) =>
      checklistItems.push(newItem)
    );
  }

  update(id: string, editedItem: AddChecklistItem) {
    this.checklistItems.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, title: editedItem.title } : item
      )
    );
  }

  remove(id: string) {
    this.checklistItems.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  removeAllItemsForChecklist(checklistId: string) {
    this.checklistItems.update((items) =>
      items.filter((item) => item.checklistId !== checklistId)
    );
  }
}
