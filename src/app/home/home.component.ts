import { Component, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ChecklistService } from "../shared/data-access/checklist.service";
import { Checklist } from "../shared/interfaces/checklist";
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ModalComponent } from "../shared/ui/modal.component";
import { ChecklistListComponent } from "./ui/checklist-list.component";

@Component({
  standalone: true,
  selector: "app-home",
  template: `
    <h1>Quicklists</h1>
    <button (click)="formModalIsOpen.set(true)">Add</button>

    <h2>Your checklists</h2>
    <app-checklist-list
      [checklists]="checklists()"
      (delete)="deleteChecklist($event)"
      (edit)="openEditModal($event)"
    />

    <app-modal [isOpen]="formModalIsOpen()">
      <ng-template>
        <app-form-modal
          title="test"
          [formGroup]="checklistForm"
          (close)="dismissModal()"
          (save)="
            checklistIdBeingEdited()
              ? editChecklist(checklistIdBeingEdited()!)
              : addChecklist()
          "
        ></app-form-modal>
      </ng-template>
    </app-modal>
  `,
  imports: [
    ModalComponent,
    FormModalComponent,
    ReactiveFormsModule,
    ChecklistListComponent,
  ],
})
export default class HomeComponent {
  formModalIsOpen = signal(false);
  checklistIdBeingEdited = signal<string | null>(null);

  checklists = this.checklistService.getChecklists();

  checklistForm = this.fb.nonNullable.group({
    title: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService
  ) {}

  dismissModal() {
    this.formModalIsOpen.set(false);
    this.checklistIdBeingEdited.set(null);
  }

  addChecklist() {
    this.checklistService.add(this.checklistForm.getRawValue());
  }

  openEditModal(checklist: Checklist) {
    this.checklistForm.patchValue({
      title: checklist.title,
    });

    this.checklistIdBeingEdited.set(checklist.id);
    this.formModalIsOpen.set(true);
  }

  editChecklist(checklistId: string) {
    this.checklistService.update(checklistId, this.checklistForm.getRawValue());
  }

  deleteChecklist(id: string) {
    this.checklistService.remove(id);
  }
}
