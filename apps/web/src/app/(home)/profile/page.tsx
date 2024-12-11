"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FiUser, FiClock, FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";
import { useTokenStore } from "../../../stores/token";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { UserMeResponse } from "../../../types/user";

interface ClubResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
}

interface ClubApplyResponse {
  id: number;
  club: ClubResponse;
  introduction: string;
  experience: string;
  motivation: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

interface StatusBadgeProps {
  status: string;
}

const Modal = ({ isOpen, onClose, onConfirm, isLoading }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">지원 취소</h3>
        <p className="text-gray-600 mb-6">
          정말로 지원을 취소하시겠습니까?
          <br />
          지원을 취소하면 다시 지원할 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
          >
            닫기
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "취소 중..." : "지원 취소"}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
      text: "검토중",
    },
    ACCEPTED: {
      color: "bg-green-100 text-green-800",
      icon: FiCheckCircle,
      text: "승인됨",
    },
    REJECTED: {
      color: "bg-red-100 text-red-800",
      icon: FiXCircle,
      text: "거절됨",
    },
    CANCELED: {
      color: "bg-gray-100 text-gray-800",
      icon: FiXCircle,
      text: "취소됨",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.color} text-sm font-medium`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

export default function ProfilePage() {
  const { accessToken } = useTokenStore();
  const queryClient = useQueryClient();
  const [cancelApplyId, setCancelApplyId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const response = await axios.get<UserMeResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (user?.profileImage && user.profileImage.startsWith("blob:")) {
      fetch(user.profileImage)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImageSrc(reader.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          setProfileImageSrc(null);
        });
    } else {
      setProfileImageSrc(user?.profileImage ?? null);
    }
  }, [user?.profileImage]);

  const { data: applies, isLoading: appliesLoading } = useQuery({
    queryKey: ["club-applies"],
    queryFn: async () => {
      const response = await axios.get<ClubApplyResponse[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/applies`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (applyId: number) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/applies/${applyId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-applies"] });
      toast.success("지원이 취소되었습니다");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("지원 취소에 실패했습니다");
    },
  });

  const handleCancelClick = (applyId: number) => {
    setCancelApplyId(applyId);
    setIsModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (cancelApplyId) {
      cancelMutation.mutate(cancelApplyId);
    }
  };

  if (userLoading || appliesLoading) {
    return (
      <div className="bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-8 flex items-center gap-6">
              {profileImageSrc ? (
                <Image
                  src={profileImageSrc}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <span>
                    {user?.grade}학년 {user?.room}반 {user?.number}번
                  </span>
                  <span>•</span>
                  <span>{user?.email}</span>
                </div>
                <div className="mt-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {user?.role === "STUDENT" ? "학생" : "선생님"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">지원 현황</h2>
            <div className="space-y-6">
              {applies?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  아직 지원한 동아리가 없습니다.
                </p>
              ) : (
                applies?.map((apply) => (
                  <div
                    key={apply.id}
                    className="flex items-center gap-6 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                  >
                    <Image
                      src={apply.club.image}
                      alt={apply.club.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      width={64}
                      height={64}
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">
                        {apply.club.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {apply.club.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={apply.status} />
                          <span className="text-sm text-gray-500">
                            • {apply.club.memberCount}명의 부원
                          </span>
                        </div>
                        {apply.status === "PENDING" && (
                          <button
                            onClick={() => handleCancelClick(apply.id)}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                          >
                            지원 취소
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelMutation.isPending}
      />
    </>
  );
}
