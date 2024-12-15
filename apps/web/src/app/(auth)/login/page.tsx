"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTokenStore } from "../../../stores/token";

interface LoginForm {
  id: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();
  const { setAccessToken, setRefreshToken } = useTokenStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      toast.success("로그인되었습니다");
      router.push("/");
    },
    onError: () => {
      toast.error("로그인에 실패했습니다");
    },
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">MOA</h1>
          <p className="mt-2 text-gray-600">동아리 지원의 새로운 시작</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-8"
        >
          <div className="mb-6">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 text-center mb-2">
                도담도담 계정으로 로그인
              </h2>
              <p className="text-sm text-gray-600 text-center">
                도담도담 아이디와 비밀번호를 사용하여
                <br />
                MOA 서비스를 이용하실 수 있습니다
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("id", {
                    required: "아이디를 입력해주세요",
                  })}
                  className={`w-full bg-white rounded-md px-10 py-2 
                    border border-gray-200 placeholder-gray-400 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                    focus-visible:outline-none transition-colors
                    ${errors.id ? "border-red-500" : ""}`}
                  placeholder="도담도담 아이디"
                />
              </div>
              {errors.id && (
                <p className="text-red-500 text-sm">{errors.id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  {...register("password", {
                    required: "비밀번호를 입력해주세요",
                  })}
                  className={`w-full bg-white rounded-md px-10 py-2 
                    border border-gray-200 placeholder-gray-400 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                    focus-visible:outline-none transition-colors
                    ${errors.password ? "border-red-500" : ""}`}
                  placeholder="도담도담 비밀번호"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 text-white rounded-md py-2 px-4 
                       font-medium hover:bg-blue-500 transition-colors
                       flex items-center justify-center gap-2
                       disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  로그인
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <a
                href="https://dodam-web.netlify.app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                도담도담 바로가기
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
