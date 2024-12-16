"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { Application, ClubApplyStatus } from "../../../types/application";
import StatusBadge from "../../../components/applications/StatusBadge";
import { moaAxios } from "../../../libs/axios";

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ClubApplyStatus | "ALL">(
    "ALL"
  );

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await moaAxios.get<Application[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/applies`
      );
      return data;
    },
  });

  const filteredApplications = applications.filter(
    (app) => statusFilter === "ALL" || app.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    toast.error("지원 내역을 불러오는데 실패했습니다.");
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">지원 내역을 불러올 수 없습니다.</p>
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

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">지원 현황</h1>
        <p className="mt-2 text-gray-600">
          동아리 지원 현황과 결과를 확인할 수 있습니다
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {["ALL", "PENDING", "ACCEPTED", "REJECTED", "CANCELED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as ClubApplyStatus | "ALL")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                statusFilter === status
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "ALL"
                ? "전체"
                : status === "PENDING"
                  ? "검토중"
                  : status === "ACCEPTED"
                    ? "합격"
                    : status === "REJECTED"
                      ? "불합격"
                      : "취소됨"}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">지원 내역이 없습니다.</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm 
                       overflow-hidden hover:border-blue-100 transition-colors"
            >
              <button
                onClick={() => setSelectedApplication(application)}
                className="w-full p-4 text-left flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {/* <Image
                    src={application.club.image}
                    alt={application.club.name}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">
                      {application.club.name}
                    </h3>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {application.introduction}
                  </p>
                </div>
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedApplication && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                     justify-center p-4 z-50"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] 
                       overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={selectedApplication.club.image}
                        alt={selectedApplication.club.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedApplication.club.name}
                      </h2>
                      <StatusBadge status={selectedApplication.status} />
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded-full 
                             hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">자기소개</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedApplication.introduction}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">
                      관련 경험
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedApplication.experience}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">
                      지원 동기
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedApplication.motivation}
                    </p>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
