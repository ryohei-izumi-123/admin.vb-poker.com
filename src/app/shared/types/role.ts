export type TRole = TUserRole | TCustomerRole;
export type TUserRole = 'administrator' | 'manager' | 'operator';
export type TCustomerRole = 'head_office' | 'master_agent' | 'agent' | 'na';
export type TTicketInquiryType =
  | 'default'
  | 'head_office_entry'
  | 'master_agent_entry'
  | 'agent_entry';
