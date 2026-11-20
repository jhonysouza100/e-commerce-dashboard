import Image from "next/image";

interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({ className, children, src, alt, isLoading = false, size = 'medium' }) => {
  const sizes = {
    small: 'h-6 w-6 min-h-6 min-w-6',
    medium: 'h-10 w-10 min-w-10 min-h-10',
    large: 'h-12 w-12 min-h-12 min-w-12',
  };

  return (
    <>
    {isLoading ?
      <div className={`${sizes[size]} bg-surface-hover animate-pulse rounded-full aspect-square`}></div> 
     : 
      <div className={`${sizes[size]} grid justify-items-center items-center justify-center aspect-square rounded-full overflow-hidden ${className || ''}`}>
        {children ? (children) :
      (src && src?.length !== 0) ? (
          <Image
            className="w-full h-full text-xs"
            src={src}
            alt={alt || 'default image'}
            width={100}
            height={100}
            loading="lazy"
            // quality={100}
          /> ) : ( <span className="uppercase text-3xl font-bold bg-primary-2">{alt?.charAt(0)}</span> )
        }
      </div>
    }
    </>
    
  );
};

export default Avatar;