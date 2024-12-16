import { ClubApplyStatus } from "../../types/application";

type StatusBadgeProps = {
  status: ClubApplyStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      text: "검토중",
      className: "bg-yellow-50 text-yellow-600 border-yellow-100",
    },
    ACCEPTED: {
      text: "합격",
      className: "bg-green-50 text-green-600 border-green-100",
    },
    REJECTED: {
      text: "불합격",
      className: "bg-red-50 text-red-600 border-red-100",
    },
    CANCELED: {
      text: "취소됨",
      className: "bg-gray-50 text-gray-600 border-gray-100",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.text}
    </span>
  );
}
