import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { Notice } from "../../types/notice";

dayjs.extend(relativeTime);
dayjs.locale("ko");

type NoticeCardProps = {
  notice: Notice;
  onClick: (notice: Notice) => void;
};

export default function NoticeCard({ notice, onClick }: NoticeCardProps) {
  const formattedDate = dayjs(notice.createdAt).fromNow();

  return (
    <button
      onClick={() => onClick(notice)}
      className="w-full text-left p-4 bg-white rounded-lg border border-gray-100 
                hover:border-blue-100 transition-all space-y-2
                sm:space-y-0 sm:flex sm:items-start sm:justify-between
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-gray-900 truncate">{notice.title}</h3>
          {notice.important && (
            <span
              className="inline-block px-2 py-1 text-xs font-medium 
                         text-red-600 bg-red-50 rounded-full"
            >
              중요
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2 break-all">
          {notice.content}
        </p>
      </div>
      <span className="text-xs text-gray-500 sm:ml-4 sm:shrink-0">
        {formattedDate}
      </span>
    </button>
  );
}
