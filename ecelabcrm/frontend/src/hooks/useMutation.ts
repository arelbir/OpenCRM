import { useMutation as useReactQueryMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ApiResponse } from '../types';

export const useMutation = <TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, unknown, TVariables>, 'mutationFn'>
): UseMutationResult<ApiResponse<TData>, unknown, TVariables, unknown> => {
  return useReactQueryMutation({
    mutationFn,
    ...options,
  });
};
