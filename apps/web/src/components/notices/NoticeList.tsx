import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Notice } from "../../types/notice";
import { Page } from "../../types/pagination";
import NoticeCard from "./NoticeCard";
import { useEffect } from "react";

type NoticeListProps = {
  pages: Page<Notice>[];
  onNoticeClick: (notice: Notice) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function NoticeList({
  pages,
  onNoticeClick,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: NoticeListProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const notices = pages.flatMap((page) => page.content);

  return (
    <div className="space-y-3">
      {notices.map((notice, index) => (
        <motion.div
          key={notice.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
        >
          <NoticeCard notice={notice} onClick={onNoticeClick} />
        </motion.div>
      ))}
      <div ref={ref} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
