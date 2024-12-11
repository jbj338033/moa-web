"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTokenStore } from "../../stores/token";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">MOA</h1>
          <p className="text-gray-400">동아리 지원의 새로운 시작</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl"
        >
          <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="text-lg font-semibold text-white">
                도담도담 계정으로 로그인
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center">
              도담도담 아이디와 비밀번호를 사용하여
              <br />
              MOA 서비스를 이용하실 수 있습니다
            </p>
          </div>

          <form
            onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                아이디
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("id", {
                    required: "아이디를 입력해주세요",
                  })}
                  className={`w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 
                    border border-gray-600 placeholder-gray-400 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-200 focus-visible:outline-none
                    ${errors.id ? "border-red-500" : ""}`}
                  placeholder="도담도담 아이디"
                />
              </div>
              {errors.id && (
                <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                비밀번호
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  {...register("password", {
                    required: "비밀번호를 입력해주세요",
                  })}
                  className={`w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 
                    border border-gray-600 placeholder-gray-400 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-200 focus-visible:outline-none
                    ${errors.password ? "border-red-500" : ""}`}
                  placeholder="도담도담 비밀번호"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg 
                py-3 px-4 font-medium hover:from-blue-500 hover:to-blue-300 
                transition-all duration-200 flex items-center justify-center group
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
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <a
                href="https://dodam.b1nd.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
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
