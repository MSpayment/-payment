import { useMutation } from "@tanstack/react-query";
import { AuthSchema } from "src/features/auth/types";
import axios from "src/libs/axios";
import { z } from "zod";

type Dto = z.infer<typeof AuthSchema>;

export const useAuth = () => {
  const loginMutation = useMutation(
    async (dto: Dto) => {
      const res = await axios.post("auth/login", dto);

      return res.data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  return { loginMutation };
};
