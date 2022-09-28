export enum ERole {
  ADMINISTRATOR = 1,
  MANAGER = 2,
  OPERATOR = 3,
  HEAD_OFFICE = 4,
  MASTER_AGENT = 5,
  AGENT = 6,
  NA = 0,
}

export const ROLE = {
  ADMINISTRATOR: String(ERole[ERole.ADMINISTRATOR]).toLowerCase(),
  MANAGER: String(ERole[ERole.MANAGER]).toLowerCase(),
  OPERATOR: String(ERole[ERole.OPERATOR]).toLowerCase(),
  HEAD_OFFICE: String(ERole[ERole.HEAD_OFFICE]).toLowerCase(),
  MASTER_AGENT: String(ERole[ERole.MASTER_AGENT]).toLowerCase(),
  AGENT: String(ERole[ERole.AGENT]).toLowerCase(),
  NA: String(ERole[ERole.NA]).toLowerCase(),
};
