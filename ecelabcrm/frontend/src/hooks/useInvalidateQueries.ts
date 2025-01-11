import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async (queries: string[]) => {
    await Promise.all(
      queries.map((query) =>
        queryClient.invalidateQueries({
          queryKey: [query],
        })
      )
    );
  };

  return invalidateQueries;
};
