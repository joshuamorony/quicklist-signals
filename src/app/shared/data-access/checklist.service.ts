import { computed, effect, Injectable, signal } from '@angular/core';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklists = signal<Checklist[]>([]);

  constructor(
    private storageService: StorageService,
    private checklistItemService: ChecklistItemService
  ) {}

  load() {
    const checklists = this.storageService.loadChecklists();
    this.checklists.set(checklists);

    effect(() => {
      this.storageService.saveChecklists(this.checklists())
    })
  }

  getChecklists() {
    return computed(() => this.checklists());
  }

  getChecklistById(id: string) {
    return computed(() => this.checklists().find((checklist) => checklist.id === id))
  }

  add(checklist: AddChecklist) {
    const newChecklist = {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };

    this.checklists.mutate((checklists) => checklists.push(newChecklist))
  }

  remove(id: string) {
    this.checklistItemService.removeAllItemsForChecklist(id);
    this.checklists.update((checklists) => checklists.filter((checklist) => checklist.id !== id))
  }

  update(id: string, editedData: AddChecklist) {
    this.checklists.update((checklists) => checklists.map((checklist) =>
      checklist.id === id
        ? { ...checklist, title: editedData.title }
        : checklist
    ))
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
 
