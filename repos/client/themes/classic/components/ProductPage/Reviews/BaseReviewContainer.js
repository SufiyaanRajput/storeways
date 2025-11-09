import { Comment } from "antd";

export const BaseReviewContainer = ({ children, userId, showReviewEditor, ...props }) => (
  !showReviewEditor && <Comment {...props}>
  {children}
</Comment>
);