import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { login, register } from "../../../services/auth-service/auth-service";
import { useUser } from "../../../providers/users/UserProvider";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { useOrder } from "../../../providers/users/OrderProvider";
import { getCard } from "../../../services/order-service/order-service";
import { useNavigate } from "react-router-dom";
import Loading from "../../Supporter/Loading";
import { useNotification } from "../../../providers/NotificationProvider";

const UserRegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Username too short')
    .max(100, 'Username too long')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore allowed')
    .required('Username required'),
  email: Yup.string()
    .required('Email required'),
  password: Yup.number()
    .required('Password required'),
});

const AuthPopup = ({ isOpen, setIsOpen }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { showNotification, NotificationPortal } = useNotificationPortal();
  const { setUser } = useUser();
  const { setCard } = useOrder();
  const navigate = useNavigate();
  const { showNotification: useNotificationShowNotification } = useNotification();

  useEffect(() => {
    // Check if there are saved credentials
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { username, password } = JSON.parse(savedCredentials);
      // Set initial values for the login form
      if (!isLogin) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
          loginForm.querySelector('input[name="username"]').value = username;
          loginForm.querySelector('input[name="password"]').value = password;
        }
      }
    }
  }, [isLogin]);

  const loginSubmit = async (values) => {
    try {
      setIsLoading(true);
      const data = await login(values);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("accessToken", data.accessToken);
      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify({
          username: values.username,
          password: values.password
        }));
      }
      await getUserCard();
      useNotificationShowNotification(NotificationType.SUCCESS, "Login success");
      setIsOpen(false);
      // Check if user is admin and redirect
      if (data.roles[0].authority === "ROLE_ADMIN") {
        navigate('/admin');
      }
    } catch (e) {
      useNotificationShowNotification(NotificationType.ERROR, e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const registerSubmit = async (values) => {
    try {
      setIsLoading(true);
      await register(values);
      useNotificationShowNotification(NotificationType.SUCCESS, "Register success");
      setIsLogin(true);
    } catch (e) {
      useNotificationShowNotification(NotificationType.ERROR, e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserCard = async () => {
    try {
      let data = await getCard();
      setCard(data);
    } catch (error) {
      console.error("Error fetching user card:", error);
    }
  }

  return (
    <>
      <NotificationPortal />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md relative"
            >
              <IoCloseOutline
                className="absolute top-4 right-4 text-2xl cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {isLogin ? "Login" : "Register"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isLogin
                    ? "Welcome back! Please login to your account."
                    : "Create an account to continue."}
                </p>
              </div>

              {isLoading ? (
                <div className="min-h-[200px] flex items-center justify-center">
                  <Loading />
                </div>
              ) : isLogin ? (
                <Formik
                  initialValues={{
                    username: localStorage.getItem('savedCredentials')
                      ? JSON.parse(localStorage.getItem('savedCredentials')).username
                      : '',
                    password: localStorage.getItem('savedCredentials')
                      ? JSON.parse(localStorage.getItem('savedCredentials')).password
                      : ''
                  }}
                  onSubmit={loginSubmit}
                >
                  <Form>
                    <label className="block text-sm font-medium">Username *</label>
                    <Field
                      type="text"
                      className="w-full border rounded p-2 mb-3"
                      name="username"
                    />
                    <label className="block text-sm font-medium">Password *</label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        className="w-full border rounded p-2 mb-3"
                        name="password"
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </div>
                    <button type="submit" className="w-full bg-[#fecb02] text-white py-2 rounded mb-3">
                      LOGIN
                    </button>
                  </Form>
                </Formik>
              ) : (
                <Formik
                  initialValues={{
                    username: '',
                    email: '',
                    password: ''
                  }}
                  validationSchema={UserRegisterSchema}
                  onSubmit={registerSubmit}
                >
                  <Form>
                    <label className="block text-sm font-medium">Username *</label>
                    <Field
                      type="text"
                      className="w-full border rounded p-2 mb-3"
                      name="username"
                    />
                    <ErrorMessage name="username">
                      {(msg) => <div className="mb-1 text-red-500 text-xs">{msg}</div>}
                    </ErrorMessage>
                    <label className="block text-sm font-medium">Email *</label>
                    <Field
                      type="text"
                      className="w-full border rounded p-2 mb-3"
                      name="email"
                    />
                    <ErrorMessage name="email">
                      {(msg) => <div className="mb-1 text-red-500 text-xs">{msg}</div>}
                    </ErrorMessage>
                    <label className="block text-sm font-medium">Password *</label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        className="w-full border rounded p-2 mb-3"
                        name="password"
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </span>
                    </div>
                    <ErrorMessage name="password">
                      {(msg) => <div className="mb-1 text-red-500 text-xs">{msg}</div>}
                    </ErrorMessage>
                    <button type="submit" className="w-full bg-[#fecb02] text-white py-2 rounded mb-3">
                      REGISTER
                    </button>
                  </Form>
                </Formik>
              )}

              <div className="text-center mt-6">
                <button
                  type="button"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
                >
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthPopup;