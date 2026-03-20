import { apiClient } from "@/utils/apiClient";
import { tokenStorage } from "@/utils/token";

// ----------------------------- Login API request -----------------------------
export const login = async (payload: { email: string; password: string }) => {
  return apiClient("auth/root", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ----------------------------- Fetch current logged-in user -----------------------------

export const profile = async (): Promise<any> => {
  const res = await apiClient("auth/root/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ` + tokenStorage.get(),
    },
  });
  return res;
};

// -----------------------------
// Change Password API request
// -----------------------------
export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  // Send change password request
  const res = await apiClient("auth/root/changepassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Change Password Response:", res);

  return res;
};

// -----------------------------
// Fetch system roles
// -----------------------------

export const getSystemRoles = async (payload: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {

  const params = new URLSearchParams();

  params.append("page", String(payload.page));
  params.append("limit", String(payload.limit));

  if (payload.search) params.append("search", payload.search);
  if (payload.status) params.append("status", payload.status);

  const res = await apiClient(`role?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

export const createRole = async (payload: {
  name: { en: string; fr: string; ar: string; ch?: string };
  description: { en: string; fr: string; ar: string; ch?: string };
  status: 'ACTIVE' | 'INACTIVE'; // added status
}) => {
  const res = await apiClient("role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Create Role Response:", res);
  return res;
};

// -----------------------------
// Update Status Commonly
// -----------------------------

export const updateStatus = async (
  type: string,
  id: string,
  payload: { status: 'ACTIVE' | 'INACTIVE' }
) => {
  const res = await apiClient(`${type}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
    body: JSON.stringify(payload), // ✅ send object, not a string
  });
  return res;
};

// -----------------------------
// Delete Entries Common function
// -----------------------------

export const deleteEntity = async (type: string, id: string) => {
  const res = await apiClient(`${type}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

// -----------------------------
// Get Role By ID
// -----------------------------

export const getRoleById = async (id: string) => {
  const res = await apiClient(`role/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

// -----------------------------
// Update Role
// -----------------------------

export const updateRole = async (id: string, data: any) => {
  const res = await apiClient(`role/${id}`, {
    method: 'PUT', // or PATCH (depends on backend)
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res;
};

// ----------------------------- Fetch system users -----------------------------

export const getSystemUsers = async (payload: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  roleId?: string;
  country?: string;
}) => {

  const params = new URLSearchParams();

  params.append("page", String(payload.page));
  params.append("limit", String(payload.limit));

  if (payload.search) params.append("search", payload.search);
  if (payload.status) params.append("status", payload.status);
  if (payload.roleId) params.append("roleId", payload.roleId);
  if (payload.country) params.append("country", payload.country);

  const res = await apiClient(`rootadmin?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

// -----------------------------
// Get Admin By ID
// -----------------------------
export const getAdminUserById = async (id: string) => {
  const res = await apiClient(`rootadmin/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

// ----------------------------- Add system users -----------------------------

export const createAdminUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phoneCode: string;
  phoneNumber: string;
  role: string; // ObjectId string
  allowedCountries: string[];
  status: string;
}) => {
  const res = await apiClient("rootadmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Create Admin User Response:", res);
  return res;
};

// ----------------------------- Edit system users -----------------------------

export const editAdminUser = async (userId: string, payload: {
  name: string;
  email: string;
  password?: string;
  phoneCode: string;
  phoneNumber: string;
  role?: string; // ObjectId string
  allowedCountries: string[];
  status: string;
}) => {
  const res = await apiClient(`rootadmin/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Edit Admin User Response:", res);
  return res;
};

// -----------------------------
// Fetch Root/Affiliate Modules
// -----------------------------

export const getModulePackages = async (
  moduleType: string,
  payload: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }
) => {
  const params = new URLSearchParams();

  if (payload.page) params.append("page", String(payload.page));
  if (payload.limit) params.append("limit", String(payload.limit));
  if (payload.search) params.append("search", payload.search);
  if (payload.status) params.append("status", payload.status);

  const res = await apiClient(`${moduleType}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenStorage.get()}`,
    },
  });

  return res;
};

// -----------------------------
// Create Root Modules
// -----------------------------

export const createRootModules = async (payload: {
  key: string;
  moduleName: {
    en: string;
    fr: string;
    ar: string;
    hi?: string;
  };
  actions: {
    key: string;
    actionName: {
      en: string;
      fr: string;
      ar: string;
      hi?: string;
    };
    status?: 'ACTIVE' | 'INACTIVE';
  }[];
  status?: 'ACTIVE' | 'INACTIVE';
}) => {
  const res = await apiClient("systemmodule/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Create Module Response:", res);
  return res;
};

// -----------------------------
// Create Tenat Modules
// 
export const createTenantModules = async (payload: {
  key: string;
  moduleName: {
    en: string;
    fr: string;
    ar: string;
    hi?: string;
  };
  actions: {
    key: string;
    actionName: {
      en: string;
      fr: string;
      ar: string;
      hi?: string;
    };
    status?: 'ACTIVE' | 'INACTIVE';
  }[];
  status?: 'ACTIVE' | 'INACTIVE';
}) => {
  const res = await apiClient("tenantmodule/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Create Module Response:", res);
  return res;
};


export const createPlan = async (payload: {
  name: {
    en: string;
    fr?: string;
    ar?: string;
    hi?: string;
  };
  description: {
    en: string;
    fr?: string;
    ar?: string;
    hi?: string;
  };
  price: number;
  currency: string;
  duration: 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'DAILY';
  status?: 'ACTIVE' | 'INACTIVE'; // ✅ add this
   modules: [],
}) => {
  const res = await apiClient("plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + tokenStorage.get(),
    },
    body: JSON.stringify(payload),
  });

  console.log("Create Plan Response:", res);
  return res;
};