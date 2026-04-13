import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { stopImpersonation } from "../store/authSlice";

export function ImpersonationBanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isImpersonating, adminName, user } = useSelector(s => s.auth);

  if (!isImpersonating) return null;

  const handleExit = () => {
    dispatch(stopImpersonation());
    navigate("/lenders");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-purple-600 text-white
      px-4 py-2.5 flex items-center justify-between shadow-lg">

      <div className="flex items-center gap-3 text-sm">
        <span className="text-lg">👤</span>
        <span>
          <span className="font-semibold">{adminName}</span>
          {" "}is viewing as{" "}
          <span className="font-black text-yellow-300">{user?.userName}</span>
        </span>
        <span className="bg-purple-700 text-purple-200 text-xs font-bold
          px-2 py-0.5 rounded-full">
          IMPERSONATING
        </span>
      </div>

      <button
        onClick={handleExit}
        className="flex items-center gap-2 bg-white text-purple-700
          font-bold text-xs px-4 py-2 rounded-lg
          hover:bg-purple-50 transition-colors cursor-pointer">
        ✕ Exit — Back to Admin
      </button>
    </div>
  );
}