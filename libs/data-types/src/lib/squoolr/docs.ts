/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/v1": {
    get: operations["AppController_getData"];
  };
  "/v1/platform-settings": {
    get: operations["AppController_getPlatformSettings"];
  };
  "/v1/auth/signin": {
    post: operations["AuthController_signIn"];
  };
  "/v1/auth/reset-password": {
    post: operations["AuthController_resetPassword"];
  };
  "/v1/auth/new-password": {
    post: operations["AuthController_setNewPassword"];
  };
  "/v1/auth/log-out": {
    delete: operations["AuthController_logOut"];
  };
  "/v1/auth/user": {
    get: operations["AuthController_getUser"];
  };
  "/v1/demands": {
    get: operations["DemandController_getAllDemands"];
  };
  "/v1/demands/{school_code}": {
    get: operations["DemandController_getDemandStatus"];
  };
  "/v1/demands/{school_code}/details": {
    get: operations["DemandController_getDemandDetails"];
  };
  "/v1/demands/new": {
    post: operations["DemandController_submitDemand"];
  };
  "/v1/demands/{school_code}/validate": {
    put: operations["DemandController_validateDemand"];
  };
  "/v1/demands/{school_code}/status": {
    patch: operations["DemandController_updateDemandStatus"];
  };
  "/v1/academic-years/all": {
    get: operations["AcademicYearsController_getAcademicYears"];
  };
  "/v1/academic-years/new": {
    post: operations["AcademicYearsController_createAcademicYear"];
  };
  "/v1/academic-years/{academic_year_id}/choose": {
    patch: operations["AcademicYearsController_chooseActiveAcademicYear"];
  };
  "/v1/inquiries": {
    get: operations["InquiriesController_getAllInquiries"];
  };
  "/v1/inquiries/new": {
    post: operations["InquiriesController_createInquiry"];
  };
  "/v1/ambassadors/all": {
    get: operations["AmbassadorsController_getAmbassadors"];
  };
  "/v1/ambassadors/{ambassador_id}": {
    get: operations["AmbassadorsController_getAmbassador"];
  };
  "/v1/ambassadors/{referral_code}/verify": {
    get: operations["AmbassadorsController_getAmbassador"];
  };
  "/v1/departments/all": {
    get: operations["DepartmentsController_getDepartments"];
  };
  "/v1/departments/new": {
    post: operations["DepartmentsController_createDepartment"];
  };
  "/v1/departments/{department_id}": {
    put: operations["DepartmentsController_updateDepartment"];
    delete: operations["DepartmentsController_deleteDepartment"];
  };
  "/v1/majors/all": {
    get: operations["MajorsController_getMajors"];
  };
  "/v1/majors/{annual_major_id}": {
    get: operations["MajorsController_getMajor"];
    put: operations["MajorsController_updateMajor"];
    delete: operations["MajorsController_deleteMajor"];
  };
  "/v1/majors/new": {
    post: operations["MajorsController_createMajor"];
  };
  "/v1/classrooms/all": {
    get: operations["ClassroomsController_getClassrooms"];
  };
  "/v1/classrooms/{annual_classroom_id}": {
    put: operations["ClassroomsController_updateClassroom"];
    delete: operations["ClassroomsController_deleteClassroom"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    PlatformSettingsEntity: {
      platform_settings_id: string;
      platform_fee: number;
      onboarding_fee: number;
      /** Format: date-time */
      created_at: string;
    };
    SignInDto: {
      email: string;
      password: string;
    };
    ActiveYearSessionData: {
      academic_year_id: string;
      /** Format: date-time */
      starting_date: string;
      /** Format: date-time */
      ending_date: string;
      /** @enum {string} */
      year_status: "INACTIVE" | "ACTIVE" | "FINISHED";
      year_code: string;
    };
    StudentSessionData: {
      annual_student_id: string;
      activeSemesters: string[];
      classroom_code: string;
      classroom_level: number;
      student_id: string;
    };
    ConfiguratorSessionData: {
      annual_configurator_id: string;
      is_sudo: boolean;
    };
    TeacherSessionData: {
      annual_teacher_id: string;
      hourly_rate: number;
      origin_institute: string;
      has_signed_convention: boolean;
      classroomDivisions: string[];
      teacher_id: string;
    };
    User: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      person_id: string;
      birthplace: string | null;
      nationality: string;
      longitude: number | null;
      latitude: number | null;
      /** @enum {string} */
      preferred_lang: "en" | "fr";
      image_ref: string | null;
      home_region: string | null;
      religion: string | null;
      handicap: string;
      /** @enum {string} */
      civil_status: "Married" | "Single" | "Divorced";
      /** @enum {string|null} */
      employment_status: "Employed" | "Unemployed" | "SelfEmployed" | null;
      /** Format: date-time */
      created_at: string;
      login_id: string;
      school_id?: string;
      tutorStudentIds?: string[];
      activeYear: components["schemas"]["ActiveYearSessionData"];
      annualStudent?: components["schemas"]["StudentSessionData"];
      annualConfigurator?: components["schemas"]["ConfiguratorSessionData"];
      annualTeacher?: components["schemas"]["TeacherSessionData"];
      annualRegistry?: components["schemas"]["TeacherSessionData"];
    };
    AcademicYearEntity: {
      /** Format: date-time */
      starts_at: string;
      /** Format: date-time */
      ends_at: string;
      academic_year_id: string;
      year_code: string;
      /** Format: date-time */
      started_at: string;
      /** Format: date-time */
      ended_at: string;
      /** @enum {string} */
      year_status: "INACTIVE" | "ACTIVE" | "FINISHED";
      school_id: string;
      /** Format: date-time */
      created_at: string;
    };
    SingInResponse: {
      user: components["schemas"]["User"];
      academicYears?: components["schemas"]["AcademicYearEntity"][];
    };
    ResetPasswordDto: {
      email: string;
    };
    SetNewPasswordDto: {
      reset_password_id: string;
      new_password: string;
    };
    PersonEntity: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      person_id: string;
      birthplace: string | null;
      nationality: string;
      longitude: number | null;
      latitude: number | null;
      /** @enum {string} */
      preferred_lang: "en" | "fr";
      image_ref: string | null;
      home_region: string | null;
      religion: string | null;
      handicap: string;
      /** @enum {string} */
      civil_status: "Married" | "Single" | "Divorced";
      /** @enum {string|null} */
      employment_status: "Employed" | "Unemployed" | "SelfEmployed" | null;
      /** Format: date-time */
      created_at: string;
    };
    SchoolEntity: {
      school_name: string;
      school_acronym: string;
      school_email: string;
      lead_funnel: string;
      school_phone_number: string;
      paid_amount: number;
      ambassador_email: string;
      school_code: string;
      /** @enum {string} */
      school_demand_status: "PENDING" | "PROCESSING" | "REJECTED" | "VALIDATED";
      school_rejection_reason: string;
      subdomain: string | null;
      /** Format: date-time */
      created_at: string;
    };
    DemandDetails: {
      school: components["schemas"]["SchoolEntity"];
      person: components["schemas"]["PersonEntity"];
    };
    CreatePersonDto: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      password: string;
    };
    CreateSchoolDto: {
      school_name: string;
      school_acronym: string;
      school_email: string;
      lead_funnel: string;
      referral_code?: string;
      school_phone_number: string;
      /** Format: date-time */
      initial_year_starts_at: string;
      /** Format: date-time */
      initial_year_ends_at: string;
    };
    SubmitDemandDto: {
      payment_phone?: string;
      configurator: components["schemas"]["CreatePersonDto"];
      school: components["schemas"]["CreateSchoolDto"];
    };
    ValidateDemandDto: {
      rejection_reason?: string;
      subdomain?: string;
    };
    CreateAcademicYearDto: {
      /** Format: date-time */
      starts_at: string;
      /** Format: date-time */
      ends_at: string;
    };
    SessionEntity: {
      login_id: string;
      school_id?: string;
      tutorStudentIds?: string[];
      activeYear: components["schemas"]["ActiveYearSessionData"];
      annualStudent?: components["schemas"]["StudentSessionData"];
      annualConfigurator?: components["schemas"]["ConfiguratorSessionData"];
      annualTeacher?: components["schemas"]["TeacherSessionData"];
      annualRegistry?: components["schemas"]["TeacherSessionData"];
    };
    InquiryEntity: {
      email: string;
      phone?: string;
      name?: string;
      message?: string;
      /** @enum {string} */
      type: "Default" | "EarlyAccess";
      inquiry_id: string;
      /** Format: date-time */
      created_at: string;
    };
    CreateInquiryDto: {
      email: string;
      phone?: string;
      name?: string;
      message?: string;
      /** @enum {string} */
      type: "Default" | "EarlyAccess";
    };
    AmbassadorEntity: {
      ambassador_id: string;
      referral_code: string;
      login_id: string;
    };
    DepartmentEntity: {
      department_id: string;
      department_name: string;
      department_acronym: string;
      department_code: string;
      /** Format: date-time */
      created_at: string;
      created_by: string;
      school_id: string;
      is_deleted: boolean;
    };
    CreateDepartmentDto: {
      department_name: string;
      department_acronym: string;
    };
    UpdateDepartmentDto: {
      department_name?: string;
      department_acronym?: string;
    };
    CreateMajorDto: {
      major_name: string;
      major_acronym: string;
      department_id: string;
      cycle_id: string;
    };
    UpdateMajorDto: {
      major_name?: string;
      major_acronym?: string;
    };
    AnnualClassroomEntity: {
      annual_classroom_id: string;
      annual_major_id: string;
      classroom_name: string;
      classroom_code: string;
      classroom_acronym: string;
      classroom_level: number;
      number_of_divisions: number;
      is_deleted: boolean;
      total_fee_due: number | null;
      registration_fee: number | null;
      annual_coordinator_id: string | null;
      classroom_id: string;
      /** Format: date-time */
      created_at: string;
    };
    UpdateClassroomDto: {
      registration_fee?: number;
      total_fee_due?: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  AppController_getData: {
    responses: {
      200: {
        content: never;
      };
    };
  };
  AppController_getPlatformSettings: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["PlatformSettingsEntity"];
        };
      };
    };
  };
  AuthController_signIn: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SignInDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["SingInResponse"];
        };
      };
    };
  };
  AuthController_resetPassword: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["ResetPasswordDto"];
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  AuthController_setNewPassword: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SetNewPasswordDto"];
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  AuthController_logOut: {
    responses: {
      200: {
        content: never;
      };
    };
  };
  AuthController_getUser: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["PersonEntity"];
        };
      };
    };
  };
  DemandController_getAllDemands: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SchoolEntity"][];
        };
      };
    };
  };
  DemandController_getDemandStatus: {
    parameters: {
      path: {
        school_code: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SchoolEntity"];
        };
      };
    };
  };
  DemandController_getDemandDetails: {
    parameters: {
      path: {
        school_code: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["DemandDetails"];
        };
      };
    };
  };
  DemandController_submitDemand: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SubmitDemandDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["SchoolEntity"];
        };
      };
    };
  };
  DemandController_validateDemand: {
    parameters: {
      path: {
        school_code: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ValidateDemandDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  DemandController_updateDemandStatus: {
    parameters: {
      path: {
        school_code: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  AcademicYearsController_getAcademicYears: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["AcademicYearEntity"][];
        };
      };
    };
  };
  AcademicYearsController_createAcademicYear: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateAcademicYearDto"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["AcademicYearEntity"];
        };
      };
    };
  };
  AcademicYearsController_chooseActiveAcademicYear: {
    parameters: {
      path: {
        academic_year_id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SessionEntity"];
        };
      };
    };
  };
  InquiriesController_getAllInquiries: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["InquiryEntity"][];
        };
      };
    };
  };
  InquiriesController_createInquiry: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateInquiryDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["InquiryEntity"];
        };
      };
    };
  };
  AmbassadorsController_getAmbassadors: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["AmbassadorEntity"][];
        };
      };
    };
  };
  AmbassadorsController_getAmbassador: {
    parameters: {
      path: {
        ambassador_id: string;
        referral_code: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["AmbassadorEntity"];
        };
      };
    };
  };
  DepartmentsController_getDepartments: {
    parameters: {
      query?: {
        is_deleted?: boolean;
        keywords?: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["DepartmentEntity"][];
        };
      };
    };
  };
  DepartmentsController_createDepartment: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateDepartmentDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["DepartmentEntity"];
        };
      };
    };
  };
  DepartmentsController_updateDepartment: {
    parameters: {
      path: {
        department_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateDepartmentDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  DepartmentsController_deleteDepartment: {
    parameters: {
      path: {
        department_id: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  MajorsController_getMajors: {
    parameters: {
      query?: {
        is_deleted?: boolean;
        keywords?: string;
        department_id?: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  MajorsController_getMajor: {
    parameters: {
      path: {
        annual_major_id: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  MajorsController_updateMajor: {
    parameters: {
      path: {
        annual_major_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateMajorDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  MajorsController_deleteMajor: {
    parameters: {
      path: {
        annual_major_id: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  MajorsController_createMajor: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateMajorDto"];
      };
    };
    responses: {
      201: {
        content: never;
      };
    };
  };
  ClassroomsController_getClassrooms: {
    parameters: {
      query: {
        is_deleted?: boolean;
        keywords?: string;
        annual_major_id: string;
        level?: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["AnnualClassroomEntity"][];
        };
      };
    };
  };
  ClassroomsController_updateClassroom: {
    parameters: {
      path: {
        annual_classroom_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateClassroomDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  ClassroomsController_deleteClassroom: {
    parameters: {
      path: {
        annual_classroom_id: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
}
