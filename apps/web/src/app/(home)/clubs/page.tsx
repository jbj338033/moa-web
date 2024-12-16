"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { Club } from "../../../types/club";
import { Page } from "../../../types/pagination";
import ClubList from "../../../components/clubs/ClubList";
import Image from "next/image";
import { FiUsers } from "react-icons/fi";

const PAGE_SIZE = 12;

export default function ClubsPage() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<Page<Club>>({
    queryKey: ["clubs"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await axios.get<Page<Club>>(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs?page=${pageParam}&size=${PAGE_SIZE}`
      );
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  });

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    window.history.pushState({ clubId: club.id }, "", `?club=${club.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    toast.error("동아리 목록을 불러오는데 실패했습니다.");
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">동아리 목록을 불러올 수 없습니다.</p>
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

  const totalClubs = data?.pages[0]?.totalElements ?? 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">동아리 찾기</h1>
        <p className="mt-2 text-gray-600">
          대덕소프트웨어마이스터고등학교의 다양한 동아리들을 만나보세요
        </p>
        {totalClubs > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            전체 {totalClubs}개의 동아리
          </p>
        )}
      </motion.div>

      {data?.pages[0]?.empty ? (
        <div className="text-center py-12">
          <p className="text-gray-600">등록된 동아리가 없습니다.</p>
        </div>
      ) : (
        <ClubList
          pages={data?.pages ?? []}
          onClubClick={handleClubClick}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      <AnimatePresence>
        {selectedClub && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                     justify-center p-4 z-50"
            onClick={() => setSelectedClub(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-64">
                <Image
                  src={selectedClub.image}
                  alt={selectedClub.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedClub.name}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="w-5 h-5 mr-1" />
                    {selectedClub.memberCount}명
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedClub.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
