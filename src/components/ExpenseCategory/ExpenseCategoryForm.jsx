import { Col, Row } from "antd";
import CustomForm from "../Shared/Form/CustomForm";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import CustomInput from "../Shared/Input/CustomInput";

const ExpenseCategoryForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};

export default ExpenseCategoryForm;
