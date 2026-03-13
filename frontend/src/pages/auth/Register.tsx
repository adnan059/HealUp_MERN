import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/hooks/useAuth";
import { handleAxiosError } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { RegisterFormValuesType } from "@/types";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValuesType>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const { mutate, isPending } = useRegisterMutation();

  const onSubmit: SubmitHandler<RegisterFormValuesType> = async (formData) => {
    mutate(formData, {
      onSuccess: async () => {
        reset();
        await refetchUser();
        navigate("/");
      },
      onError: (error) => {
        handleAxiosError(error);
      },
    });
  };
  return (
    <section className="register authSection" id="register">
      <div className="sectionContainer">
        <div className="authFormContainer">
          <h2 className="authFormTitle">Create an Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            {/* NAME */}
            <div className="authFormSection">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name cannot exceed 50 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="authFormErrorMessage">{errors.name.message}</p>
              )}
            </div>

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
                <p className="authFormErrorMessage">{errors.email.message}</p>
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
                <p className="authFormErrorMessage">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
        <p className="authFormFooter">
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
