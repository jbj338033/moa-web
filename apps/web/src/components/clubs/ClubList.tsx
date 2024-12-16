import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Club } from "../../types/club";
import { Page } from "../../types/pagination";
import ClubCard from "./ClubCard";
import { useEffect } from "react";

type ClubListProps = {
  pages: Page<Club>[];
  onClubClick: (club: Club) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function ClubList({
  pages,
  onClubClick,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ClubListProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const clubs = pages.flatMap((page) => page.content);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club, index) => (
        <motion.div
          key={club.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
        >
          <ClubCard club={club} onClick={onClubClick} />
        </motion.div>
      ))}
      <div ref={ref} className="col-span-full h-4" />
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center py-4">
          <div
            className="animate-spin rounded-full h-6 w-6 border-2 
                       border-blue-500 border-t-transparent"
          />
        </div>
      )}
    </div>
  );
}
