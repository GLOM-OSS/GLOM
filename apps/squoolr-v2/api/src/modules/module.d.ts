import { Prisma } from "@prisma/client";

export type QueryParams = {
  is_deleted?: boolean;
  keywords?: string;
};

export type MetaParams = {
  academic_year_id: string;
  school_id: string;
};

export type BatchPayload = Prisma.BatchPayload & { message: string };
