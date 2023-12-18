import {
  CycleEntity,
  TeacherTypeEntity,
  TeachingGradeEntity,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class HelpersApi {
  constructor(private readonly request: GlomRequest) {}

  async getTeacherTypes() {
    const resp = await this.request.get<TeacherTypeEntity[]>('/teacher-types');
    return resp.data;
  }

  async getTeachingGrades() {
    const resp = await this.request.get<TeachingGradeEntity[]>(
      '/teaching-grades'
    );
    return resp.data;
  }

  async getCycles() {
    const resp = await this.request.get<CycleEntity[]>('/cycles');
    return resp.data;
  }
}
