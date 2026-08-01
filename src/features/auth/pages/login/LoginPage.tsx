import { LoginForm } from "../../components";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <LoginForm onLoginExitoso={() => console.log("¡Sesión iniciada!")} />
    </div>
  );
};