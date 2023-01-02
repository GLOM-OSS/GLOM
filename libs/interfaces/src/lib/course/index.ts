export interface CreateLink {
    resource_ref: string;
    resource_name: string;
}

export interface Resource extends CreateLink {
  resource_id: string;
  chaper_id: string | null;
  resource_type: 'FILE' | 'LINK';
  resource_extension: string | null;
  annual_credit_unit_subject_id: string;
}

export interface CreateChapter {
  chapter_title: string;
  chapter_objective: string;
  annual_credit_unit_subject_id: string;
  chapter_parent_id?: string;
}

export interface Chapter extends CreateChapter {
  chapter_id: string;
}
