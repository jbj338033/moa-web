import Image from "next/image";
import { FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { Club } from "../../types/club";

type ClubCardProps = {
  club: Club;
  onClick: (club: Club) => void;
};

export default function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <motion.button
      onClick={() => onClick(club)}
      className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-100 
                overflow-hidden group focus:outline-none focus:ring-2 
                focus:ring-blue-100 hover:border-blue-200 transition-all"
    >
      <div className="relative w-full h-40">
        <Image
          src={club.image}
          alt={club.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{club.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {club.description}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <FiUsers className="w-4 h-4 mr-1" />
          {club.memberCount}명의 부원
        </div>
      </div>
    </motion.button>
  );
}
