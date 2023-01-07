interface PresenceListChapter {
  is_covered: boolean;
  chpater_id: string;
  chapter_title: string;
}
export interface PresenceList {
  end_time: Date;
  start_time: Date;
  subject_code: string;
  subject_title: string;
  is_published: boolean;
  presence_list_date: Date;

  students: Student[];
  chapters: PresenceListChapter[];
}

export interface Student {
  annual_student_id: string;
  is_present: boolean;
  matricule: string;
  fullname: string;
}

export interface UpdatePresenceList
  extends Omit<PresenceList, 'chapters' | 'students'> {
  addedChapterIds: string[];
  removedChapterIds: string[];

  addedStudentIds: string[];
  removedStudentIds: string[];
}
