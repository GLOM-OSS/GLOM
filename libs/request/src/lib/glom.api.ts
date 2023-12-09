import {
  AcademicYearApi,
  AmbassadorsApi,
  AuthApi,
  InquiriesApi,
  PaymentsApi,
  PlatformSettingsApi,
  SchoolsApi,
  StaffApi,
} from '../squoolr';
import { DepartmentsApi } from '../squoolr/departments.api';
import { MajorsApi } from '../squoolr/majors.api';
import { GlomRequest, RequestParams } from './glom-request';

export const GLOM_HOSTS = {
  lynkr: 'https://api.lynkr.net',
  squoolr: 'https://be.squoolr.com',
};
export const getURI = (app: keyof typeof GLOM_HOSTS) => {
  const DEV_PORT = 8000;

  const host =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${DEV_PORT}`
      : GLOM_HOSTS[app];

  return { host };
};

export class GlomApi {
  public squoolr: {
    auth: AuthApi;
    staffs: StaffApi;
    schools: SchoolsApi;
    payments: PaymentsApi;
    inquiries: InquiriesApi;
    ambassadors: AmbassadorsApi;
    academicYears: AcademicYearApi;
    platformSettings: PlatformSettingsApi;
    departments: DepartmentsApi;
    majors: MajorsApi;
  };

  constructor(public params?: Partial<RequestParams>) {
    const { host } = getURI('squoolr');
    const squoolrRequest = new GlomRequest({
      ...params,
      prefix: '',
      host,
    });

    this.squoolr = {
      auth: new AuthApi(squoolrRequest),
      staffs: new StaffApi(squoolrRequest),
      schools: new SchoolsApi(squoolrRequest),
      payments: new PaymentsApi(squoolrRequest),
      inquiries: new InquiriesApi(squoolrRequest),
      ambassadors: new AmbassadorsApi(squoolrRequest),
      academicYears: new AcademicYearApi(squoolrRequest),
      platformSettings: new PlatformSettingsApi(squoolrRequest),
      departments: new DepartmentsApi(squoolrRequest),
      majors: new MajorsApi(squoolrRequest),
    };
  }
}
