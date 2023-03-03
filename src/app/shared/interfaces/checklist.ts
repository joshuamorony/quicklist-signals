export interface Checklist {
  id: string;
  title: string;
}

export type AddChecklist = Pick<Checklist, 'title'>;

