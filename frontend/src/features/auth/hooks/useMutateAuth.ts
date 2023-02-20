import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { AuthSchema } from "src/features/auth/types";
import axios from "src/libs/axios";
import { z } from "zod";

type Dto = z.infer<typeof AuthSchema>;

export const useAuth = () => {
  const router = useRouter();
  const loginMutation = useMutation(
    async (dto: Dto) => {
      const res = await axios.post<string>("auth/login", dto);

      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data === "OK") {
          router.push("/dashboard");
        }
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  return { loginMutation };
};
