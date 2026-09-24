import { UserRole, MainTab } from '../types';

export const PUBLIC_TABS: MainTab[] = ['Login', 'Home', 'About', 'Help & Support'];

export const ROLE_DEFAULT_TABS: Record<UserRole, { tab: MainTab; subTab?: string }> = {
  FACILITY_OPERATOR: {
    tab: 'Data Management',
    subTab: 'Enter Data',
  },
  DISTRICT_OFFICER: {
    tab: 'Dashboard',
    subTab: 'Overview',
  },
  STATE_ADMIN: {
    tab: 'Dashboard',
    subTab: 'Programme Analytics',
  },
  SUPER_ADMIN: {
    tab: 'Admin Panel',
    subTab: 'Users',
  },
};

export function isTabAllowedForRole(tab: MainTab, role: UserRole | null): { allowed: boolean; reason?: string } {
  // Public tabs are accessible to everyone
  if (PUBLIC_TABS.includes(tab)) {
    return { allowed: true };
  }

  // If not logged in, all non-public tabs are blocked
  if (!role) {
    return {
      allowed: false,
      reason: `Access to ${tab} requires an authenticated HDIMS session. Please log in with your institutional credentials.`,
    };
  }

  // Super Admin has access to everything
  if (role === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  // Admin Panel is restricted ONLY to Super Admin
  if (tab === 'Admin Panel') {
    return {
      allowed: false,
      reason: 'The Admin Panel is strictly reserved for HDIMS National Systems Administrators.',
    };
  }

  // Facility Operator restrictions
  if (role === 'FACILITY_OPERATOR') {
    // Facility operators can access Home, About, Data Management, Help & Support, Notifications
    const allowedForFacility: MainTab[] = ['Home', 'About', 'Data Management', 'Notifications', 'Help & Support', 'Reports'];
    if (!allowedForFacility.includes(tab)) {
      return {
        allowed: false,
        reason: `Your account role (Facility Data Entry Operator) does not have clearance for ${tab}. Access is restricted to District and State Monitoring Officers.`,
      };
    }
  }

  return { allowed: true };
}

export function isSubTabAllowedForRole(tab: MainTab, subTab: string, role: UserRole | null): { allowed: boolean; reason?: string } {
  const tabCheck = isTabAllowedForRole(tab, role);
  if (!tabCheck.allowed) return tabCheck;

  // Specific sub-tab guards
  if (tab === 'Data Management' && subTab === 'Data Validation') {
    if (role === 'FACILITY_OPERATOR') {
      return {
        allowed: false,
        reason: 'Data Validation and Approval is reserved for District Programme Officers, State Health Missionaries, and Super Administrators. Facility operators may only view Submitted Data status.',
      };
    }
  }

  if (tab === 'Reports' && (subTab === 'District Reports' || subTab === 'State Reports')) {
    if (role === 'FACILITY_OPERATOR') {
      return {
        allowed: false,
        reason: 'District and State-level consolidated reports are accessible by District and State administrators.',
      };
    }
  }

  return { allowed: true };
}
