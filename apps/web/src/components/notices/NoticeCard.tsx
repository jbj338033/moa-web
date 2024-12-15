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

function NoticeCard({ notice, onClick }: NoticeCardProps) {
  const formattedDate = dayjs(notice.createdAt).fromNow();

  return (
    <div
      onClick={() => onClick(notice)}
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 
                hover:border-blue-100 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{notice.title}</h3>
            {notice.important && (
              <span
                className="px-2 py-1 text-xs font-medium text-red-600 
                           bg-red-50 rounded-full"
              >
                중요
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {notice.content}
          </p>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
}

export default NoticeCard;