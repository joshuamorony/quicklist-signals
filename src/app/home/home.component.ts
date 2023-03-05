import { Component, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ChecklistService } from "../shared/data-access/checklist.service";
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ModalComponent } from "../shared/ui/modal.component";

@Component({
  standalone: true,
  imports: [ModalComponent, FormModalComponent, ReactiveFormsModule],
  selector: "app-home",
  template: `
    <h1>Quicklists</h1>
    <button (click)="formModalIsOpen$.set(true)">Add</button>

    <h2>Your checklists</h2>
    <!-- app-checklist-list -->

    <app-modal [isOpen]="formModalIsOpen$()">
      <ng-template>
        <app-form-modal
          title="test"
          [formGroup]="checklistForm"
          (close)="dismissModal()"
        ></app-form-modal>
      </ng-template>
    </app-modal>
  `,
})
export default class HomeComponent {
  formModalIsOpen$ = signal(false);
  checklistIdBeingEdited$ = signal<string | null>(null);

  checklists = this.checklistService.getChecklists();

  checklistForm = this.fb.nonNullable.group({
    title: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService
  ) {}

  dismissModal() {
    this.formModalIsOpen$.set(false);
  }
}
