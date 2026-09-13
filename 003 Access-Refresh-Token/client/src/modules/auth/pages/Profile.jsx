import { useEffect } from "react";
import { useAuthContext } from "../context/AuthProvider";
import useApi from "../../../shared/useApi";

const Profile = () => {
  const authContext = useAuthContext();
  const api = useApi();

  async function fetachProfile() {
    const response = await api.get("/auth/me", authContext.accessToken);

    authContext.setUser(response.data.data.user);
  }

  useEffect(() => {
    fetachProfile();
  }, []);

  return (
    <div>
      <h1>profile</h1>
      <p>Name : {authContext.user?.name}</p>
      <p>Email : {authContext.user?.email}</p>
    </div>
  );
};

export default Profile;
