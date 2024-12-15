import { motion } from "framer-motion";
import { Notice } from "../../types/notice";
import NoticeCard from "./NoticeCard";

type NoticeListProps = {
  notices: Notice[];
  onNoticeClick: (notice: Notice) => void;
};

function NoticeList({ notices, onNoticeClick }: NoticeListProps) {
  return (
    <div className="space-y-4">
      {notices.map((notice, index) => (
        <motion.div
          key={notice.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <NoticeCard notice={notice} onClick={onNoticeClick} />
        </motion.div>
      ))}
    </div>
  );
}

export default NoticeList;
