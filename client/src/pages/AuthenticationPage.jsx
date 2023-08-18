import PageContent from "../components/PageContent";
import AuthForm from "../components/AuthForm";

const AuthenticationPage = () => {
  return (
    <>
      <PageContent title={"Authentication"}>
        <AuthForm />
      </PageContent>
    </>
  );
};

export default AuthenticationPage;
