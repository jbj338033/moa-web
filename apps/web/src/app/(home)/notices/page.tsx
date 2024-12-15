"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import axios from "axios";
import NoticeList from "../../../components/notices/NoticeList";
import { Notice } from "../../../types/notice";
import { Page } from "../../../types/pagination";

const PAGE_SIZE = 15;

export default function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<Page<Notice>>({
    queryKey: ["notices"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await axios.get<Page<Notice>>(
        `${process.env.NEXT_PUBLIC_API_URL}/notices?page=${pageParam}&size=${PAGE_SIZE}`
      );
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  });

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    window.history.pushState(
      { noticeId: notice.id },
      "",
      `?notice=${notice.id}`
    );
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
    window.history.pushState({}, "", window.location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      setSelectedNotice(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    toast.error("공지사항을 불러오는데 실패했습니다.");
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">공지사항을 불러올 수 없습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 
                   rounded-md transition-colors"
        >
          새로고침
        </button>
      </div>
    );
  }

  const totalNotices = data?.pages[0]?.totalElements ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
        <p className="mt-2 text-gray-600">
          MOA의 최신 소식과 업데이트를 확인하세요
        </p>
        {totalNotices > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            전체 {totalNotices}개의 공지사항
          </p>
        )}
      </motion.div>

      {data?.pages[0]?.empty ? (
        <div className="text-center py-12">
          <p className="text-gray-600">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <NoticeList
          pages={data?.pages ?? []}
          onNoticeClick={handleNoticeClick}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                    justify-center p-4 z-50 overscroll-contain"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] 
                      overflow-y-auto overscroll-contain p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 break-all">
                    {selectedNotice.title}
                  </h2>
                  {selectedNotice.important && (
                    <span
                      className="inline-block mt-2 px-2 py-1 text-xs font-medium 
                                 text-red-600 bg-red-50 rounded-full"
                    >
                      중요
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="ml-4 p-1 text-gray-500 hover:text-gray-700 
                         rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
              <div className="prose prose-sm max-w-none break-all">
                {selectedNotice.content}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                마지막 수정:{" "}
                {dayjs(selectedNotice.updatedAt).format(
                  "YYYY년 MM월 DD일 HH:mm"
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
