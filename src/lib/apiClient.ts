/**
 * Centralized API Client for EduIdentityAI FastAPI Backend
 * Handles HTTP transport, JWT authorization headers, and API error handling.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('edu_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorBody.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<{ status: string; federated_stores: number }> {
  return fetchApi('/api/v1/health');
}

export async function issueBackendVC(student: {
  name: string;
  roll_no: string;
  apaar_id: string;
  department: string;
  cgpa: number;
  credits_earned: number;
  institution?: string;
}): Promise<any> {
  const params = new URLSearchParams({
    name: student.name,
    roll_no: student.roll_no,
    apaar_id: student.apaar_id,
    department: student.department,
    cgpa: student.cgpa.toString(),
    credits_earned: student.credits_earned.toString(),
    institution: student.institution || 'GL Bajaj Institute of Technology & Management'
  });

  return fetchApi(`/api/v1/credentials/issue?${params.toString()}`, {
    method: 'POST'
  });
}
