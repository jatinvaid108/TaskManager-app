import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Input with a leading icon; password fields get a show/hide toggle
export default function AuthInput({ icon, type = "text", ...props }) {
  const Icon = icon;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
      />
      <input
        type={isPassword && showPassword ? "text" : type}
        aria-label={props.placeholder}
        className={`input pl-11 ${isPassword ? "pr-12" : ""}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-subtle transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light/40"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
