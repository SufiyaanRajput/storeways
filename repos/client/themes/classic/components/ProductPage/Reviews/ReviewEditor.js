import { Col, Form, Row } from "antd";
import { Input } from "themes/classic/common";
import { Button } from "base";
import { ReviewEditor } from "./styles";

const ReviewEditorWrapper = ({ onChange, onSubmit, closeEditor, submitting, value, id }) => (
  <ReviewEditor>
    <Form.Item>
      <Input.TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Row gutter={16} justify="end">
      <Col>
        <Form.Item>
          <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            {id ? 'Update' : 'Add Comment'}
          </Button>
        </Form.Item>
      </Col>
      {
        id &&
        <Col>
          <Form.Item>
            <Button loading={submitting} onClick={closeEditor} type="secondary">
              Cancel
            </Button>
          </Form.Item>
        </Col>
      }
    </Row>
  </ReviewEditor>
);

export default ReviewEditorWrapper;