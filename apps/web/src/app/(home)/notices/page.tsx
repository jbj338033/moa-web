"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import NoticeList from "../../../components/notices/NoticeList";
import Pagination from "../../../components/common/Pagination";
import { Notice } from "../../../types/notice";
import { Page } from "../../../types/pagination";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const PAGE_SIZE = 10;

export default function NoticesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const {
    data: pageResponse,
    isLoading,
    error,
  } = useQuery<Page<Notice>>({
    queryKey: ["notices", currentPage],
    queryFn: async () => {
      const { data } = await axios.get<Page<Notice>>(
        `${process.env.NEXT_PUBLIC_API_URL}/notices?page=${currentPage}&size=${PAGE_SIZE}`
      );
      return data;
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    toast.error("공지사항을 불러오는데 실패했습니다.");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
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

  const notices = pageResponse?.content || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
        <p className="mt-2 text-gray-600">
          MOA의 최신 소식과 업데이트를 확인하세요
        </p>
        {!pageResponse?.empty && (
          <p className="mt-1 text-sm text-gray-500">
            전체 {pageResponse?.totalElements}개의 공지사항
          </p>
        )}
      </motion.div>

      {notices.length > 0 ? (
        <>
          <NoticeList notices={notices} onNoticeClick={handleNoticeClick} />
          {pageResponse && (
            <Pagination page={pageResponse} onPageChange={handlePageChange} />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">등록된 공지사항이 없습니다.</p>
        </div>
      )}

      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                      justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] 
                     overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{selectedNotice.title}</h2>
                {selectedNotice.important && (
                  <span
                    className="px-2 py-1 text-xs font-medium text-red-600 
                               bg-red-50 rounded-full"
                  >
                    중요
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              {selectedNotice.content}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              마지막 수정:{" "}
              {dayjs(selectedNotice.updatedAt).format("YYYY년 MM월 DD일 HH:mm")}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
