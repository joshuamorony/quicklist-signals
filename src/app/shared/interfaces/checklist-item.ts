export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export type AddChecklistItem = Pick<ChecklistItem, 'title'>;

