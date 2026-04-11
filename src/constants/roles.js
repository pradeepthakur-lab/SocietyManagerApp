export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  TREASURER: 'treasurer',
  RESIDENT: 'resident',
  TENANT: 'tenant',
  SECURITY: 'security',
};

export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TREASURER];
export const MANAGER_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TREASURER];
export const RESIDENT_ROLES = [ROLES.RESIDENT, ROLES.TENANT];
export const SECURITY_ROLES = [ROLES.SECURITY];

export const BILL_STATUS = {
  UNPAID: 'unpaid',
  PENDING_VERIFICATION: 'pending_verification',
  PAID: 'paid',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending_verification',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PAYMENT_METHODS = {
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  CASH: 'cash',
};

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
};

export const COMPLAINT_CATEGORIES = [
  'Plumbing',
  'Electricity',
  'Parking',
  'Lift Issue',
  'Noise Complaint',
  'Other',
];

export const VISITOR_STATUS = {
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
};

export const VISITOR_PURPOSES = [
  'Guest',
  'Delivery',
  'Maintenance',
  'Domestic Help',
  'Cab / Taxi',
  'Other',
];

export const VEHICLE_TYPES = {
  TWO_WHEELER: 'two_wheeler',
  FOUR_WHEELER: 'four_wheeler',
  OTHER: 'other',
};

export const VEHICLE_MONTHLY_CHARGES = {
  two_wheeler: 200,
  four_wheeler: 500,
  other: 300,
};

export default ROLES;
