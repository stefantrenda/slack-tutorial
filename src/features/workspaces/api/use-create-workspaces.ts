import { useCallback, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { error } from "console";
import { isSet } from "util/types";

type RequestType = { name: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateWorkspace = () => {
  const mutation = useMutation(api.workspaces.create);

  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [isPending, setIsPending] = useState(false);
  const [isSueccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      try {
        setData(null);
        setError(null);
        setIsError(false);
        setIsSettled(false);
        setIsSuccess(false);
        
        setIsPending(true);

        const response = await mutation(values);
        options.onSuccess?.(response);
        return response;
      } catch (error) {
        options.onError?.(error as Error);
        if (options.throwError) {
          throw error;
        }
      } finally {
        options.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
  };
};
