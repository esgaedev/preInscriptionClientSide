import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { PreRegistrationPayload, PreRegistrationResponse } from '@/types';

export async function submitPreRegistration(
  payload: PreRegistrationPayload,
): Promise<PreRegistrationResponse> {
  const { data } = await axiosClient.post<PreRegistrationResponse>(
    API_ENDPOINTS.preRegistration,
    payload,
  );
  return data;
}
