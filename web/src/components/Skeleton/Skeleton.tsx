interface SkeletonProps {
  type?: "text" | "title" | "paragraph" | "button" | "card" | "avatar" | "image" | "input";
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ type = "text", className = "" }) => {
  const baseClasses = "animate-pulse bg-gray-500 rounded";

  const typeClasses = {
    text: "h-4 w-3/4",
    title: "h-6 w-1/2",
    paragraph: "h-4 w-full mb-2",
    button: "h-10 w-24",
    card: "h-32 w-full",
    avatar: "h-12 w-12 rounded-full",
    image: "h-48 w-full",
    input: "h-10 w-full"
  };

  const combinedClasses = `${baseClasses} ${typeClasses[type]} ${className}`;

  return <div className={combinedClasses}></div>;
};

export default Skeleton;
