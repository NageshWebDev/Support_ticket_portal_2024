import { Field, Input, Label, Button } from "@headlessui/react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/api/loginAPI";
import {
  setTokenId,
  setUserEmail,
  setUserName,
  setUserId,
  setUserRole,
} from "../../store/feature/userInfoSlice";

export function Login() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await login(formData).unwrap();
      const { data } = response;
      const {
        token: tokenId,
        email: userEmail,
        name: userName,
        userId,
        userRole,
      } = data;
      dispatch(setUserEmail({ userEmail }));
      dispatch(setUserName({ userName }));
      dispatch(setTokenId({ tokenId }));
      dispatch(setUserId({ userId }));
      dispatch(setUserRole({ userRole }));
      navigateTo("/");
    } catch (error) {
      console.error("Failed to login :", error.data.message);
    }
  }

  return (
    <section className="h-full flex justify-center items-center">
      <div className="relative w-96">
        <h1 className="my-5 font-medium border-b text-2xl border-gray-300 pb-3">
          Login
        </h1>
        <form ref={formRef} onSubmit={onSubmitHandler} className="formStyle ">
          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">User email</Label>
              <Input
                placeholder="Type email"
                name="email"
                className="textFieldStyle"
                required
              />
            </Field>
          </div>

          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">User password</Label>
              <Input
                placeholder="Type password"
                name="password"
                className="textFieldStyle"
                required
              />
            </Field>
          </div>

          <div className="w-full flex flex-col justify-center px-4">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "genericDisablePrimary" : "genericPrimaryBtn"
              } !w-full !text-lg`}
            >
              {isLoading ? "Veryfing" : "Login"}
            </Button>
            <div className="w-full flex justify-center pt-16">
              <p>
                No account, no worries just
                <NavLink className="text-sky-600 underline pl-2" to="/signup">
                  Sign Up
                </NavLink>
              </p>
            </div>
          </div>
        </form>
        {isError && (
          <p className="absolute w-full -bottom-12 text-sm bg-red-50 text-center text-red-400 rounded-md py-1.5 border border-red-200 shadow capitalize">
            *{error.data.message}
          </p>
        )}
      </div>
    </section>
  );
}
