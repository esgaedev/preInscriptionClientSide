import { useMutation } from '@tanstack/react-query';
import { submitPreRegistration } from '@/services/preRegistrationService';

export function useCreatePreRegistration() {
  return useMutation({
    mutationFn: submitPreRegistration,
  });
}
