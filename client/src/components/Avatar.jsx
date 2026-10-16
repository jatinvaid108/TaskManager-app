// Round initial avatar; the color is picked from the user id so it stays stable
const colors = ["bg-violet-600", "bg-blue-600", "bg-orange-600", "bg-emerald-700", "bg-pink-600"];

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

const pickColor = (key = "") =>
  colors[[...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % colors.length];

export default function Avatar({ name, id, size = "md", className = "" }) {
  return (
    <span
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizes[size]} ${pickColor(id || name || "")} ${className}`}
    >
      {name?.charAt(0).toUpperCase() || "?"}
    </span>
  );
}
