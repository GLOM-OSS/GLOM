export interface CreateLink {
  chapter_id: string | null;
  resource_ref: string;
  resource_name: string;
  annual_credit_unit_subject_id: string;
}

export interface Resource extends CreateLink {
  resource_id: string;
  resource_type: 'FILE' | 'LINK';
  resource_extension: string | null;
}

export interface CreateChapter {
  chapter_title: string;
  chapter_objective: string;
  annual_credit_unit_subject_id: string;
  chapter_position: number;
  chapter_parent_id?: string;
}

export interface Chapter extends CreateChapter {
  chapter_id: string;
}

export interface CreateFile {
  files: FileList;
  details: {
    annual_credit_unit_subject_id: string;
    chapter_id: string | null;
  };
}
