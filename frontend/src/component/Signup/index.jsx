import { Description, Field, Input, Label, Button } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../store/api/loginAPI";
import {
  setTokenId,
  setUserEmail,
  setUserName,
  setUserId,
  setUserRole,
} from "../../store/feature/userInfoSlice";
import { setUserInfoOnLocalStorage } from "../../util/localStorage";

export function Signup() {
  const formRef = useRef();
  const tokenId = useSelector((state) => state.userInfoReducer.tokenId);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (tokenId) {
      navigateTo("/");
    }
  }, [tokenId, navigateTo]);

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await register(formData).unwrap();
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
      setUserInfoOnLocalStorage({
        tokenId,
        userEmail,
        userName,
        userId,
        userRole,
      });
      navigateTo("/");
    } catch (error) {
      console.error("Failed to create the ticket", error);
    }
  }

  return (
    <section className="h-full w-full flex justify-center items-center">
      <div>
        <h1 className="my-5 font-medium border-b text-2xl border-gray-300 pb-3">
          Sign Up
        </h1>
        <form ref={formRef} onSubmit={onSubmitHandler} className="formStyle ">
          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">User name</Label>
              <Description className="descriptionStyle">
                Enter your full name as you would like it to appear on your
                account.
              </Description>
              <Input
                placeholder="Type name"
                name="name"
                className="textFieldStyle"
                required
              />
            </Field>
          </div>

          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">User email</Label>
              <Description className="descriptionStyle">
                Enter your email address that will be associated with your
                account
              </Description>
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
              <Description className="descriptionStyle">
                Choose a secure password for your account.
              </Description>
              <Input
              type="password"
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
              {isLoading ? "Please wait" : "Sign Up"}
            </Button>
            <div className="w-full flex justify-center pt-16">
              <p>
                Already have an account?
                <NavLink className="text-sky-600 underline pl-2" to="/login">
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
