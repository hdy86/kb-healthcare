import { ClipLoader } from "react-spinners";

interface LoadingProps {
  className?: string;
  size?: number;
}

export default function Loading({ className, size = 40 }: LoadingProps) {
  return (
    <div className={`loading_area ${className || ""}`}>
      <ClipLoader color='#5bc8c4' loading={true} size={size} speedMultiplier={0.6} />
    </div>
  );
}
