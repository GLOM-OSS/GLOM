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
  "/v1/teacher-types": {
    get: operations["AppController_getTeacherTypes"];
  };
  "/v1/teaching-grades": {
    get: operations["AppController_getTeachingGrades"];
  };
  "/v1/cycles": {
    get: operations["AppController_getCycles"];
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
  "/v1/payments/onboarding-fee": {
    post: operations["PaymentsController_initEntryFeePayment"];
  };
  "/v1/schools": {
    get: operations["SchoolsController_getSchools"];
  };
  "/v1/schools/{school_id}": {
    get: operations["SchoolsController_getSchool"];
  };
  "/v1/schools/{school_code}": {
    get: operations["SchoolsController_getSchool"];
  };
  "/v1/schools/{school_id}/details": {
    get: operations["SchoolsController_getSchoolDetails"];
  };
  "/v1/schools/new": {
    post: operations["SchoolsController_submitSchoolDemand"];
  };
  "/v1/schools/{school_id}/validate": {
    put: operations["SchoolsController_validateSchoolDemand"];
  };
  "/v1/schools/my-school": {
    put: operations["SchoolsController_updateSchool"];
  };
  "/v1/schools/settings": {
    get: operations["SchoolsController_getSchoolSettings"];
    put: operations["SchoolsController_updateSchoolSettings"];
  };
  "/v1/schools/{school_id}/status": {
    put: operations["SchoolsController_updateSchoolStatus"];
  };
  "/v1/academic-years": {
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
  "/v1/ambassadors": {
    get: operations["AmbassadorsController_getAmbassadors"];
  };
  "/v1/ambassadors/{ambassador_id}": {
    get: operations["AmbassadorsController_getAmbassador"];
  };
  "/v1/ambassadors/{referral_code}/verify": {
    get: operations["AmbassadorsController_getAmbassador"];
  };
  "/v1/departments": {
    get: operations["DepartmentsController_getDepartments"];
    delete: operations["DepartmentsController_disableManyDepartments"];
  };
  "/v1/departments/new": {
    post: operations["DepartmentsController_createDepartment"];
  };
  "/v1/departments/{department_id}": {
    put: operations["DepartmentsController_updateDepartment"];
    delete: operations["DepartmentsController_disableDepartment"];
  };
  "/v1/majors": {
    get: operations["MajorsController_getMajors"];
    delete: operations["MajorsController_disableMajors"];
  };
  "/v1/majors/{annual_major_id}": {
    get: operations["MajorsController_getMajor"];
    put: operations["MajorsController_updateMajor"];
    delete: operations["MajorsController_deleteMajor"];
  };
  "/v1/majors/new": {
    post: operations["MajorsController_createMajor"];
  };
  "/v1/classrooms": {
    get: operations["ClassroomsController_getClassrooms"];
    delete: operations["ClassroomsController_disableManyClassrooms"];
  };
  "/v1/classrooms/{annual_classroom_id}": {
    put: operations["ClassroomsController_updateClassroom"];
    delete: operations["ClassroomsController_deleteClassroom"];
  };
  "/v1/staffs": {
    get: operations["StaffController_getStaffs"];
    delete: operations["StaffController_disableManyStaff"];
  };
  "/v1/staffs/{annual_teacher_id}": {
    get: operations["StaffController_getStaff"];
    put: operations["StaffController_updateStaff"];
    delete: operations["StaffController_disableStaff"];
  };
  "/v1/staffs/{annual_coordinator_id}": {
    get: operations["StaffController_getStaff"];
    put: operations["StaffController_updateStaff"];
    delete: operations["StaffController_disableStaff"];
  };
  "/v1/staffs/{annual_configurator_id}": {
    get: operations["StaffController_getStaff"];
    put: operations["StaffController_updateStaff"];
    delete: operations["StaffController_disableStaff"];
  };
  "/v1/staffs/{annual_registry_id}": {
    get: operations["StaffController_getStaff"];
    put: operations["StaffController_updateStaff"];
    delete: operations["StaffController_disableStaff"];
  };
  "/v1/staffs/new": {
    post: operations["StaffController_createStaff"];
  };
  "/v1/staffs/private-codes": {
    put: operations["StaffController_resetStaffPrivateCodes"];
  };
  "/v1/staffs/reset-passwords": {
    post: operations["StaffController_resetStaffPasswords"];
  };
  "/v1/staffs/{login_id}/roles": {
    put: operations["StaffController_updateStaffRoles"];
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
    TeacherTypeEntity: {
      teacher_type_id: string;
      teacher_type: string;
      /** Format: date-time */
      created_at: string;
    };
    TeachingGradeEntity: {
      teaching_grade_id: string;
      teaching_grade: string;
      /** Format: date-time */
      created_at: string;
    };
    CycleEntity: {
      cycle_id: string;
      /** @enum {string} */
      cycle_name: "HND" | "DUT" | "DTS" | "BACHELOR" | "MASTER" | "DOCTORATE";
      number_of_years: number;
      /** Format: date-time */
      created_at: string;
    };
    SignInDto: {
      email: string;
      password: string;
    };
    UserEntity: {
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
      active_year_id?: string;
      roles: ("ADMIN" | "PARENT" | "STUDENT" | "TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
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
      user: components["schemas"]["UserEntity"];
      academicYears?: components["schemas"]["AcademicYearEntity"][];
    };
    ResetPasswordDto: {
      email: string;
    };
    SetNewPasswordDto: {
      reset_password_id: string;
      new_password: string;
    };
    EntryFeePaymentDto: {
      payment_phone: string;
      callback_url: string;
    };
    PaymentEntity: {
      payment_id: string;
      amount: number;
      payment_ref: string;
      /** @enum {string} */
      provider: "Stripe" | "NotchPay";
      /** @enum {string} */
      payment_reason: "Fee" | "Platform" | "Onboarding" | "Registration";
    };
    InitPaymentResponse: {
      payment: components["schemas"]["PaymentEntity"];
      authorization_url: string;
    };
    SchoolEntity: {
      school_name: string;
      school_acronym: string;
      school_email: string;
      lead_funnel: string;
      school_phone_number: string;
      school_id: string;
      school_code: string;
      paid_amount: number;
      ambassador_email: string;
      /** @enum {string} */
      school_demand_status: "PENDING" | "PROCESSING" | "REJECTED" | "VALIDATED" | "SUSPENDED";
      school_rejection_reason: string;
      subdomain: string | null;
      creation_decree_number: string | null;
      description: string | null;
      /** Format: date-time */
      created_at: string;
      longitude: number;
      latitude: number;
      address: string;
      logo_ref: string;
      is_validated: boolean;
      is_deleted: boolean;
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
    CreateAcademicYearDto: {
      /** Format: date-time */
      starts_at: string;
      /** Format: date-time */
      ends_at: string;
    };
    SchoolDemandDetails: {
      school: components["schemas"]["SchoolEntity"];
      person: components["schemas"]["PersonEntity"];
      academicYear: components["schemas"]["CreateAcademicYearDto"];
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
    SubmitSchoolDemandDto: {
      payment_id?: string;
      configurator: components["schemas"]["CreatePersonDto"];
      school: components["schemas"]["CreateSchoolDto"];
    };
    ValidateSchoolDemandDto: {
      rejection_reason?: string;
      subdomain?: string;
    };
    UpdateSchoolDto: {
      school_name?: string;
      school_acronym?: string;
      school_email?: string;
      school_phone_number?: string;
      subdomain?: string | null;
      creation_decree_number?: string | null;
      description?: string | null;
      address?: string;
      logo_ref?: string;
    };
    DocumentSignerEntity: {
      /** @example Yongua */
      signer_name: string;
      /** @example The Rector */
      signer_title: string;
      /** @example Mr, Ms, Dr, etc */
      honorific: string;
      hierarchy_level: number;
      annual_document_signer_id: string;
      annual_school_setting_id: string;
      /** Format: date-time */
      created_at: string;
    };
    SchoolSettingEntity: {
      annual_school_setting_id: string;
      academic_year_id: string;
      can_pay_fee: boolean;
      /** @enum {string} */
      mark_insertion_source: "Teacher" | "Registry";
      /** Format: date-time */
      created_at: string;
      documentSigners: components["schemas"]["DocumentSignerEntity"][];
    };
    CreateDocumentSignerDto: {
      /** @example Yongua */
      signer_name: string;
      /** @example The Rector */
      signer_title: string;
      /** @example Mr, Ms, Dr, etc */
      honorific: string;
      hierarchy_level: number;
    };
    UpdateSchoolSettingDto: {
      can_pay_fee?: boolean;
      /** @enum {string} */
      mark_insertion_source?: "Teacher" | "Registry";
      deletedSignerIds?: string[];
      newDocumentSigners?: components["schemas"]["CreateDocumentSignerDto"];
    };
    UpdateSchoolDemandStatus: {
      /** @enum {string} */
      school_demand_status: "PENDING" | "PROCESSING" | "REJECTED" | "VALIDATED" | "SUSPENDED";
    };
    UserAnnualRoles: {
      active_year_id?: string;
      roles: ("ADMIN" | "PARENT" | "STUDENT" | "TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
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
    AnnualMajorEntity: {
      major_name: string;
      major_acronym: string;
      department_id: string;
      annual_major_id: string;
      major_id: string;
      department_acronym: string;
      cycle: components["schemas"]["CycleEntity"];
      /** Format: date-time */
      created_at: string;
      is_deleted: boolean;
    };
    UpdateMajorDto: {
      major_name?: string;
      major_acronym?: string;
    };
    AnnualClassroomEntity: {
      annual_classroom_id: string;
      annual_major_id: string;
      classroom_name: string;
      classroom_acronym: string;
      classroom_level: number;
      number_of_divisions: number;
      is_deleted: boolean;
      annual_coordinator_id: string | null;
      classroom_id: string;
      /** Format: date-time */
      created_at: string;
    };
    UpdateClassroomDto: {
      number_of_divisions: number;
    };
    TeacherEntity: {
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
      /** @enum {string} */
      role: "TEACHER";
      teaching_grade_id: string;
      teacher_type_id: string;
      origin_institute: string;
      hourly_rate: number;
      has_signed_convention: boolean;
      has_tax_payers_card: boolean;
      tax_payer_card_number?: string;
      annual_teacher_id: string;
      login_id: string;
      matricule: string;
      /** @default false */
      is_deleted: boolean;
      /** Format: date-time */
      last_connected: string;
      roles: ("TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
    };
    CoordinatorEntity: {
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
      teaching_grade_id: string;
      teacher_type_id: string;
      origin_institute: string;
      hourly_rate: number;
      has_signed_convention: boolean;
      has_tax_payers_card: boolean;
      tax_payer_card_number?: string;
      annual_teacher_id: string;
      login_id: string;
      matricule: string;
      /** @default false */
      is_deleted: boolean;
      /** Format: date-time */
      last_connected: string;
      roles: ("TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
      /** @enum {string} */
      role: "COORDINATOR";
      annualClassroomIds: string[];
    };
    StaffEntity: {
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
      /** @enum {string} */
      role: "TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR";
      login_id: string;
      matricule: string;
      /** @default false */
      is_deleted: boolean;
      /** Format: date-time */
      last_connected: string;
      annual_configurator_id?: string;
      annual_registry_id?: string;
      annual_teacher_id?: string;
      roles: ("TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
    };
    CreateConfiguratorDto: {
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
      /** @enum {string} */
      role: "CONFIGURATOR";
    };
    CreateRegistryDto: {
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
      /** @enum {string} */
      role: "REGISTRY";
    };
    CreateCoordinatorDto: {
      /** @enum {string} */
      role: "COORDINATOR";
      annual_teacher_id: string;
      annualClassroomIds: string[];
    };
    CreateTeacherDto: {
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
      /** @enum {string} */
      role: "TEACHER";
      teaching_grade_id: string;
      teacher_type_id: string;
      origin_institute: string;
      hourly_rate: number;
      has_signed_convention: boolean;
      has_tax_payers_card: boolean;
      tax_payer_card_number?: string;
    };
    CreateStaffDto: {
      payload: components["schemas"]["CreateConfiguratorDto"] | components["schemas"]["CreateRegistryDto"] | components["schemas"]["CreateCoordinatorDto"] | components["schemas"]["CreateTeacherDto"];
    };
    CategorizedStaffIDs: {
      teacherIds: string[];
      registryIds: string[];
      configuratorIds: string[];
    };
    BatchPayloadDto: {
      count: number;
      message: string;
      /** @description describes the next action the client needs to perform */
      next_action?: string;
    };
    UpdateConfiguratorDto: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      /** @enum {string} */
      role: "CONFIGURATOR";
    };
    UpdateRegistryDto: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      /** @enum {string} */
      role: "REGISTRY";
    };
    UpdateCoordinatorDto: {
      /** @enum {string} */
      role: "COORDINATOR";
      annualClassroomIds: string[];
    };
    UpdateTeacherDto: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      /** Format: date-time */
      birthdate?: string;
      /** @enum {string} */
      gender?: "Male" | "Female";
      address?: string;
      national_id_number?: string;
      /** @enum {string} */
      role: "TEACHER";
      teaching_grade_id?: string;
      teacher_type_id?: string;
      origin_institute?: string;
      hourly_rate?: number;
      has_signed_convention?: boolean;
      has_tax_payers_card?: boolean;
      tax_payer_card_number?: string;
    };
    UpdateStaffDto: {
      payload: components["schemas"]["UpdateConfiguratorDto"] | components["schemas"]["UpdateRegistryDto"] | components["schemas"]["UpdateCoordinatorDto"] | components["schemas"]["UpdateTeacherDto"];
    };
    CoordinateClassDto: {
      annualClassroomIds: string[];
    };
    UpdateStaffRoleDto: {
      newRoles: ("TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
      disabledStaffPayload?: components["schemas"]["CategorizedStaffIDs"];
      coordinatorPayload?: components["schemas"]["CoordinateClassDto"];
      teacherPayload?: components["schemas"]["UpdateTeacherDto"];
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
  AppController_getTeacherTypes: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["TeacherTypeEntity"][];
        };
      };
    };
  };
  AppController_getTeachingGrades: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["TeachingGradeEntity"][];
        };
      };
    };
  };
  AppController_getCycles: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["CycleEntity"][];
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
      204: {
        content: never;
      };
    };
  };
  AuthController_getUser: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserEntity"];
        };
      };
    };
  };
  PaymentsController_initEntryFeePayment: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["EntryFeePaymentDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["InitPaymentResponse"];
        };
      };
    };
  };
  SchoolsController_getSchools: {
    parameters: {
      query?: {
        is_deleted?: boolean;
        keywords?: string;
        schoolDemandStatus?: ("PENDING" | "PROCESSING" | "REJECTED" | "VALIDATED" | "SUSPENDED")[];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SchoolEntity"][];
        };
      };
    };
  };
  SchoolsController_getSchool: {
    parameters: {
      path: {
        school_id: string;
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
  SchoolsController_getSchoolDetails: {
    parameters: {
      path: {
        school_id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SchoolDemandDetails"];
        };
      };
    };
  };
  SchoolsController_submitSchoolDemand: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SubmitSchoolDemandDto"];
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
  SchoolsController_validateSchoolDemand: {
    parameters: {
      path: {
        school_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ValidateSchoolDemandDto"];
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  SchoolsController_updateSchool: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateSchoolDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  SchoolsController_getSchoolSettings: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SchoolSettingEntity"];
        };
      };
    };
  };
  SchoolsController_updateSchoolSettings: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateSchoolSettingDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  SchoolsController_updateSchoolStatus: {
    parameters: {
      path: {
        school_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateSchoolDemandStatus"];
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
      201: {
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
          "application/json": components["schemas"]["UserAnnualRoles"];
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
  DepartmentsController_disableManyDepartments: {
    parameters: {
      query: {
        departmentIds: string[];
      };
    };
    responses: {
      204: {
        content: never;
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
      204: {
        content: never;
      };
    };
  };
  DepartmentsController_disableDepartment: {
    parameters: {
      path: {
        department_id: string;
      };
    };
    responses: {
      204: {
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
  MajorsController_disableMajors: {
    parameters: {
      query: {
        annualMajorIds: string[];
        disable: boolean;
      };
    };
    responses: {
      204: {
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
      204: {
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
      204: {
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
        content: {
          "application/json": components["schemas"]["AnnualMajorEntity"];
        };
      };
    };
  };
  ClassroomsController_getClassrooms: {
    parameters: {
      query?: {
        is_deleted?: boolean;
        keywords?: string;
        annual_major_id?: string;
        annual_coordinator_id?: string;
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
  ClassroomsController_disableManyClassrooms: {
    parameters: {
      query: {
        disable: boolean;
        annualClassroomIds: string[];
      };
    };
    responses: {
      204: {
        content: never;
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
      204: {
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
      204: {
        content: never;
      };
    };
  };
  StaffController_getStaffs: {
    parameters: {
      query?: {
        is_deleted?: boolean;
        keywords?: string;
        roles?: ("TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR")[];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["StaffEntity"][];
        };
      };
    };
  };
  StaffController_disableManyStaff: {
    parameters: {
      query: {
        teacherIds: string[];
        registryIds: string[];
        configuratorIds: string[];
        disable: boolean;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["BatchPayloadDto"];
        };
      };
    };
  };
  StaffController_getStaff: {
    parameters: {
      query: {
        role: "TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR";
      };
      path: {
        annual_teacher_id: string;
      };
    };
    responses: {
      /** @description `StaffEntity`, `TeacherEntity` or `CoordinatorEntity` will ne returned depending on request query */
      200: {
        content: {
          "application/json": components["schemas"]["StaffEntity"] | components["schemas"]["TeacherEntity"] | components["schemas"]["CoordinatorEntity"];
        };
      };
    };
  };
  StaffController_updateStaff: {
    parameters: {
      path: {
        annual_teacher_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateStaffDto"];
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  StaffController_disableStaff: {
    parameters: {
      query: {
        role: "TEACHER" | "REGISTRY" | "COORDINATOR" | "CONFIGURATOR";
        disable: boolean;
      };
      path: {
        annual_teacher_id: string;
      };
    };
    responses: {
      204: {
        content: never;
      };
    };
  };
  StaffController_createStaff: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateStaffDto"];
      };
    };
    responses: {
      /** @description `StaffEntity`, `TeacherEntity` or `CoordinatorEntity` will ne returned depending on request body */
      201: {
        content: {
          "application/json": components["schemas"]["StaffEntity"] | components["schemas"]["TeacherEntity"] | components["schemas"]["CoordinatorEntity"];
        };
      };
    };
  };
  StaffController_resetStaffPrivateCodes: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CategorizedStaffIDs"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["BatchPayloadDto"];
        };
      };
    };
  };
  StaffController_resetStaffPasswords: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CategorizedStaffIDs"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["BatchPayloadDto"];
        };
      };
    };
  };
  StaffController_updateStaffRoles: {
    parameters: {
      path: {
        login_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateStaffRoleDto"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["BatchPayloadDto"];
        };
      };
    };
  };
}
