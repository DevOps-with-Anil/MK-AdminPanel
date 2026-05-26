import { apiClient } from "@/utils/apiClient";

/* ==========================================================================
   AUTH APIs
========================================================================== */

// Login
export const login = async (payload: { email: string; password: string }) => {
  return apiClient("auth/root", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logout = async ():  Promise<any> => {
  return apiClient("auth/root/logout", {
    method: "POST",
  });
};

// Get current user profile
export const profile = async (): Promise<any> => {
  return apiClient("auth/root/me", { method: "GET" });
};

// Update profile
export const updateProfile = async (
  data: FormData
) => {

  const res = await apiClient(
    "auth/root/updateprofile",
    {
      method: "PUT",
      body: data,
    }
  );

  console.log(
    "Update Profile Response:",
    res
  );

  return res;
};

// Change password
export const changePassword = async (data: any) => {
  const res = await apiClient("auth/root/changepassword", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Change Password Response:", res);
  return res;
};


/* ==========================================================================
   SYSTEM ACCESS MANAGEMENT
========================================================================== */

// Get system roles
export const getSystemRoles = async (payload: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();

  if (payload.page) params.append("page", String(payload.page));
  if (payload.limit) params.append("limit", String(payload.limit));
  if (payload.search) params.append("search", payload.search);
  if (payload.status) params.append("status", payload.status);

  return apiClient(`role?${params.toString()}`, { method: "GET" });
};

// Create role
export const createRole = async (data: any) => {
  const res = await apiClient("role", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Role Response:", res);
  return res;
};

// Update status (generic)
export const updateStatus = async (
  type: string,
  id: string,
  payload: { status: "ACTIVE" | "INACTIVE" }
) => {
  return apiClient(`${type}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

// Delete entity (generic)
export const deleteEntity = async (type: string, id: string) => {
  return apiClient(`${type}/${id}`, { method: "DELETE" });
};

// Get role by ID
export const getRoleById = async (id: string) => {
  return apiClient(`role/${id}`, { method: "GET" });
};

// Update role
export const updateRole = async (id: string, data: any) => {
  return apiClient(`role/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Update role permissions
export const updateRoleModules = async (roleId: string, data: any) => {
  return apiClient(`role/${roleId}/permissions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


/* ==========================================================================
   SYSTEM USERS
========================================================================== */

// Get system users
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

  return apiClient(`rootadmin?${params.toString()}`, {
    method: "GET",
  });
};

// Get user by ID
export const getAdminUserById = async (id: string) => {
  return apiClient(`rootadmin/${id}`, { method: "GET" });
};


// Create user
export const createAdminUser = async (data: FormData) => {
  const res = await apiClient("rootadmin", {
    method: "POST",
    body: data,
  });

  console.log("Create Admin User Response:", res);
  return res;
};

export const editAdminUser = async (userId: string, data: FormData) => {
  const res = await apiClient(`rootadmin/${userId}`, {
    method: "PUT",
    body: data, // ✅ pass FormData directly
  });

  console.log("Edit Admin User Response:", res);
  return res;
};


/* ==========================================================================
   MODULES
========================================================================== */

// Get modules
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

  return apiClient(`${moduleType}?${params.toString()}`, {
    method: "GET",
  });
};

// Create root module
export const createRootModules = async (data: any) => {
  const res = await apiClient("systemmodule/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Module Response:", res);
  return res;
};

// Create tenant module
export const createTenantModules = async (data: any) => {
  const res = await apiClient("tenantmodule/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Module Response:", res);
  return res;
};


/* ==========================================================================
   PLANS
========================================================================== */

// Get plans
export const getPlans = async (payload: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const params = new URLSearchParams();

  params.append("page", String(payload.page));
  params.append("limit", String(payload.limit));
  if (payload.search) params.append("search", payload.search);

  return apiClient(`plan?${params.toString()}`, { method: "GET" });
};

// Create plan
export const createPlan = async (data: any) => {
  const res = await apiClient("plan", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Plan Response:", res);
  return res;
};

// Get plan by ID
export const getPlantoEdit = async (id: string) => {
  const res = await apiClient(`plan/fetch/${id}`, { method: "GET" });

  console.log("Plan Details Response:", res);
  return res;
};

// Update plan
export const updatePlan = async (planId: string, data: any) => {
  return apiClient(`plan/${planId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Update plan modules
export const updatePlanModules = async (planId: string, data: any) => {
  return apiClient(`plan/${planId}/modules`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


/* ==========================================================================
   AFFILIATES
========================================================================== */

// Get affiliates
export const getAffiliates = async (payload: {
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

  return apiClient(`affiliate?${params.toString()}`, {
    method: "GET",
  });
};

// Create affiliate
export const createAffiliate = async (data: any) => {
  const res = await apiClient("affiliate", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Affiliate Response:", res);
  return res;
};

// Get affiliate by ID
export const getTenantById = async (id: string) => {
  return apiClient(`affiliate/${id}`, { method: "GET" });
};

// Get affiliate (edit)
export const getTenantByIdtoEdit = async (id: string) => {
  return apiClient(`affiliate/fetch/${id}`, { method: "GET" });
};

// Update Affiliate (Tenant)
export const updateAffiliate = async (
  affiliateId: string,
  data: any
) => {
  const res = await apiClient(`affiliate/${affiliateId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  console.log("Update Affiliate Response:", res);
  return res;
};

export const updateLogo = async (tenantId: string, data: FormData) => {
  const res = await apiClient(`affiliate/updateTenantLogo/${tenantId}`, {
    method: "PUT",
    body: data, // 
  });

  console.log("Update Logo Resonse", res);
  return res;
};


/* ==========================================================================
   KYB
========================================================================== */

// Upload Tenant KYB
export const uploadTenantKYB = async (data: FormData) => {
  const res = await apiClient("tenantkyb/upload", {
    method: "POST",
    body: data,
  });

  console.log("Upload Tenant KYB Response:", res);
  return res;
};

// Get tenant KYB
export const getTenantKYB = async (id: string) => {
  return apiClient(`tenantkyb/${id}`, { method: "GET" });
};

// Get KYB doc types
export const getKYBDocTypes = async () => {
  return apiClient("kybdoc", { method: "GET" });
};

// Delete Documet FIle
export const DeleteKYBDocFile = async (data: any) => {
  const res = await apiClient("tenantkyb/file/delete", {
    method: "POST",
     body: JSON.stringify(data),
  });
  console.log("Delete KYB File Response:", res);
  return res;
}


// Update Documet Status
export const updateKYBStatus = async (data: any) => {
  const res = await  apiClient("tenantkyb/update-document", {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("Update KYB Document Status Res", res);
  return res;
};


/* ==========================================================================
   TENANT SUBSCRIPTIONS
========================================================================== */

// Assign plan
export const assignTenantPlan = async (data: any) => {
  const res = await apiClient("tenant-subscriptions/assign-plan", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Assign Plan Response:", res);
  return res;
};

// Cancel plan
export const cancelTenantPlan = async (data: any) => {
  const res = await apiClient("tenant-subscriptions/cancel", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Cancel Plan Response:", res);
  return res;
};

// Update plan
export const updateTenantPlan = async (data: any) => {
  const res = await apiClient("tenant-subscriptions/update-plan", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Update Plan Response:", res);
  return res;
};

// Get tenant plan
export const getTenantPlan = async (
  tenantId: string
) => {
  const res = await apiClient(
    `tenant-subscriptions/${tenantId}`,
    {
      method: 'GET',
    }
  );

  console.log(
    'Get Tenant Plan Response:',
    res
  );

  return res;
};

// Get tenant plan historical data
export const getTenantPlanHistory = async (
  tenantId: string
) => {
  const res = await apiClient(
    `tenant-subscriptions/history/${tenantId}`,
    {
      method: 'GET',
    }
  );

  console.log(
    'Get Tenant Plan History Response:',
    res
  );

  return res;
};

// Get tenant plan historical data
export const getKYBListtoVerify = async (payload: {
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

  const res = await apiClient(
    `tenantkyb`,
    {
      method: 'GET',
    }
  );

  console.log(
    'Get All KYBs List Response:',
    res
  );

  return res;
};