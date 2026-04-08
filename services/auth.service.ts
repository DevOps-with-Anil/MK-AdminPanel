
import { apiClient } from "@/utils/apiClient";


// ----------------------------- Login API request -----------------------------
export const login = async (payload: { email: string; password: string }) => {

  return apiClient("auth/root", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ----------------------------- Fetch current logged-in user -----------------------------
export const profile = async (): Promise<any> => {
  return await apiClient("auth/root/me", { method: "GET" });
};

// ----------------------------- Change Password API request -----------------------------
export const changePassword = async (data: any) => {
  // Send change password request
  const res = await apiClient("auth/root/changepassword", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Change Password Response:", res);

  return res;
};

// ----------------------------- Fetch system roles -----------------------------
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
  });

  return res;
};

// ----------------------------- Create roles -----------------------------
export const createRole =  async (data: any) => {
  const res = await apiClient("role", {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("Create Role Response:", res);
  return res;
};

// ----------------------------- Update Status Commonly -----------------------------
export const updateStatus = async (
  type: string,
  id: string,
  payload: { status: 'ACTIVE' | 'INACTIVE' }
) => {
  const res = await apiClient(`${type}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res;
};

// ----------------------------- Delete Entries Common function -----------------------------
export const deleteEntity = async (type: string, id: string) => {
  const res = await apiClient(`${type}/${id}`, {
    method: 'DELETE',
  });
  return res;
};

// ----------------------------- Get Role By ID -----------------------------
export const getRoleById = async (id: string) => {
  const res = await apiClient(`role/${id}`, {
    method: 'GET',
  });
  return res;
};

// ----------------------------- Update Role -----------------------------
export const updateRole = async (id: string, data: any) => {
  const res = await apiClient(`role/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return res;
};

// ----------------------------- Update Role Permissin  -----------------------------
export const updateRoleModules = async (roleId: string, data: any) => {
  const res = await apiClient(`role/${roleId}/permissions`, {
    method: 'POST',
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
  });

  return res;
};

// ----------------------------- Get Admin By ID -----------------------------
export const getAdminUserById = async (id: string) => {
  const res = await apiClient(`rootadmin/${id}`, {
    method: 'GET',
  });

  return res;
};

// ----------------------------- Add system users -----------------------------
export const createAdminUser = async (data: any) => {
  const res = await apiClient("rootadmin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Admin User Response:", res);
  return res;
};

// ----------------------------- Edit system users -----------------------------
export const editAdminUser = async (userId: string, data: any) => {
  const res = await apiClient(`rootadmin/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  console.log("Edit Admin User Response:", res);
  return res;
};

// ----------------------------- Fetch Root/Affiliate Modules -----------------------------
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
  });

  return res;
};

// ----------------------------- Create Root Modules -----------------------------
export const createRootModules = async (data: any) => {
  const res = await apiClient("systemmodule/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Module Response:", res);
  return res;
};

// ----------------------------- Create Tenat Modules -----------------------------
export const createTenantModules = async (data: any) => {
  const res = await apiClient("tenantmodule/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Module Response:", res);
  return res;
};

// ----------------------------- Create List All Plans -----------------------------
export const getPlans = async (payload: {
  page?: number;
  limit?: number;
  search?: string;

}) => {

  const params = new URLSearchParams();

  params.append("page", String(payload.page));
  params.append("limit", String(payload.limit));

  if (payload.search) params.append("search", payload.search);

  const res = await apiClient(`plan?${params.toString()}`, {
    method: "GET",
  });

  return res;
};

// ----------------------------- Create Plan -----------------------------
export const createPlan = async (data: any) => {
  const res = await apiClient("plan", {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Create Plan Response:", res);
  return res;
};

// ----------------------------- Get Plan By ID to Edit -----------------------------
export const getPlantoEdit = async (id: string) => {
  const res = await apiClient(`plan/fetch/${id}`, {
    method: 'GET',
  });
  console.log("Plan Details Response:", JSON.stringify(res));

  return res;
};

// ----------------------------- Edit Plan  -----------------------------
export const updatePlan = async (planId: string, data: any) => {
  const res = await apiClient(`plan/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return res;
};

// ----------------------------- Update Plan Permissin  -----------------------------
export const updatePlanModules = async (planId: string, data: any) => {
  const res = await apiClient(`plan/${planId}/modules`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return res;
};

// ----------------------------- Fetch Affiliates -----------------------------
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

  const res = await apiClient(`affiliate?${params.toString()}`, {
    method: "GET",
  });

  return res;
};

// ----------------------------- Create Affiliates -----------------------------
export const createAffiliate = async (data: any) => {
  const res = await apiClient("affiliate", {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("Create Affiliate Response:", res);
  return res;
};

// ----------------------------- Get Affiliate By ID -----------------------------
export const getAffiliateById = async (id: string) => {
  const res = await apiClient(`affiliate/${id}`, {
    method: 'GET',
  });
  return res;
};