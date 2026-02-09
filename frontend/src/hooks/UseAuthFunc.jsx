import { useContext } from "react";
import { AuthContext } from "../pages/admin/auth/Autherization";

export const useAuth = () => useContext(AuthContext);