import { Person } from "../interfaces";

export interface PresenceListChapter {
  is_covered: boolean;
  chapter_id: string;
  chapter_title: string;
}

export interface Student extends Person {
  annual_student_id: string;
  is_present?: boolean;
  matricule: string;
}

export interface CreatePresenceList {
  end_time: Date;
  start_time: Date;
  presence_list_date: Date;
  annual_credit_unit_subject_id: string;

  studentIds: string[];
  chapterIds: string[];
}

export interface PresenceList
  extends Omit<
    CreatePresenceList,
    'studentIds' | 'chapterIds' | 'annual_credit_unit_subject_id'
  > {
  subject_code: string;
  subject_title: string;
  is_published: boolean;
  presence_list_id: string;

  students: Student[];
  chapters: PresenceListChapter[];
}

export interface UpdatePresenceList
  extends Omit<
    CreatePresenceList,
    'studentIds' | 'chapterIds' | 'annual_credit_unit_subject_id'
  > {
  addedChapterIds: string[];
  removedChapterIds: string[];

  addedStudentIds: string[];
  removedStudentIds: string[];
}
