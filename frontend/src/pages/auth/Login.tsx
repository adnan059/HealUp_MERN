import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/useAuth";
import { handleAxiosError } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export type LoginFormValuesType = {
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValuesType>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValuesType> = async (formData) => {
    console.log("Submitted:", formData);

    mutate(formData, {
      onSuccess: async (data) => {
        console.log("Login Data:", data);
        await refetchUser();
        navigate("/");
      },
      onError: (error) => {
        handleAxiosError(error);
      },
    });

    // later:
    // await axios.post("/auth/register", data)
  };
  return (
    <section className="login authSection" id="login">
      <div className="sectionContainer">
        <div className="authFormContainer">
          <h2 className="authFormTitle">Log In</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            {/* EMAIL */}
            <div className="authFormSection">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="authFormSection">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Login In Process..." : "Login"}
            </Button>
          </form>
        </div>
        <p className="authFormFooter">
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
