import Image from "next/image";
import { getTimeAgo } from "../utils/time";
import { Post } from "../mocks/posts";
import HeartIcon from "./Hearticion";

export default function Modal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card-bg rounded-xl overflow-hidden max-w-lg w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header con usuario */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary">
            <Image
              src={post.user?.avatar || 'https://vzhfyibobsgszzgrtont.supabase.co/storage/v1/object/sign/Supagram/profiles/yo.png?token=eyJraWQiOiJhODNlYThjMS00MmIyLTQyMjktOWJjMy1jYTMzMjUzZGU0MWYiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJTdXBhZ3JhbS9wcm9maWxlcy95by5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkwMTk0MDc3LCJleHAiOjE3OTA3OTg4Nzd9.IEyr8ojMm_q7YBVkbgvekqu5yBdaMfm7PfsAhCGOcyRPiICO_W-cBKCUM0QGW6V5fv2W7S_zoO2m9GJ4z6ZMYw'}
              alt={post.user?.username || 'default user'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{post.user?.username || 'default user'}</span>
            <span className="text-xs text-foreground/50">{getTimeAgo(new Date(post.created_at))}</span>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative w-full aspect-square">
          <Image
            src={post.image_url}
            alt={`Post de ${post.user?.username || 'default user'}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Likes y caption */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <HeartIcon filled={true} />
            <span className="text-lg font-bold text-foreground">
              {post.likes.toLocaleString()} likes
            </span>
          </div>
          <p className="mt-2 text-foreground">
            <span className="font-semibold">{post.user?.username ||'default user'}</span>{" "}
            <span className="text-foreground/80">{post.caption}</span>
          </p>
        </div>
      </div>
    </div>
  );
}