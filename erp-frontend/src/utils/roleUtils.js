/**
 * Utility functions for role handling
 */

/**
 * Format role from uppercase (ADMIN) to title case (Admin)
 * Used for UI display and role-based routing
 */
export const formatRole = (role) => {
  if (!role) return null;
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

/**
 * Convert role to uppercase for API calls
 */
export const toUppercaseRole = (role) => {
  return role?.toUpperCase() || "STUDENT";
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  const roleMap = {
    ADMIN: "Admin",
    TEACHER: "Teacher",
    STUDENT: "Student",
    ADMINISTRATOR: "Administrator",
    Admin: "Admin",
    Teacher: "Teacher",
    Student: "Student",
    Administrator: "Administrator",
  };
  return roleMap[role] || role;
};

/**
 * Check if role has specific permission
 */
export const hasRole = (userRole, requiredRole) => {
  return getRoleDisplayName(userRole) === getRoleDisplayName(requiredRole);
};

/**
 * Check if role is admin or administrator
 */
export const isAdmin = (role) => {
  const formatted = getRoleDisplayName(role);
  return formatted === "Admin" || formatted === "Administrator";
};

/**
 * Get permissions for a role
 */
export const getRolePermissions = (role) => {
  const formatted = getRoleDisplayName(role);
  const permissionsMap = {
    Admin: ["dashboard", "students", "attendance", "grades", "schedule", "users", "reports"],
    Teacher: ["dashboard", "students", "attendance", "grades", "schedule"],
    Student: ["dashboard", "grades", "attendance", "schedule"],
    Administrator: ["dashboard", "students", "users", "reports", "schedule"],
  };
  return permissionsMap[formatted] || [];
};

/**
 * Check if user can access a feature
 */
export const canAccess = (userRole, feature) => {
  return getRolePermissions(userRole).includes(feature);
};
