import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import Analytics from "../components/Analytics";
import moment from "moment";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alltransaction, setAlltransaction] = useState([]);
  const [editable, setEditable] = useState(null);
  const [viewData, setViewData] = useState("table");
  const [form] = Form.useForm();
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");


  // Column definition for the transaction table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              form.setFieldsValue(record); // Set initial values for editing
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // Fetch all transactions
  

  // Effect to load transactions initially
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transactions/get-transaction", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAlltransaction(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transaction");
        setLoading(false);
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  // Handle delete transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transacationId: record._id,
      });
      message.success("Transaction Deleted!");
      // getAllTransactions();
    } catch (error) {
      console.log(error);
      message.error("Unable to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for adding/editing transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        message.success("Transaction Added Successfully");
      }
      // getAllTransactions();
      closeModal();
    } catch (error) {
      message.error("Failed to add/update transaction");
    } finally {
      setLoading(false);
    }
  };

  // Close modal and reset form state
  const closeModal = () => {
    setShowModal(false);
    setEditable(null);
    form.resetFields(); // Reset form fields when modal is closed
  };

  // Handle "Add New" button click
  const handleAddNew = () => {
    setEditable(null); // Ensure editable is cleared for new entry
    form.resetFields(); // Reset form fields for a fresh new entry
    setShowModal(true);
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
        <h6>Select Frequency</h6>
        <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 year</Select.Option>
            {/* <Select.Option value="custom">custom</Select.Option> */}
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={handleAddNew} // Use handleAddNew for clearing form on add
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={alltransaction} rowKey="_id" />
        ) : (
          <Analytics alltransaction={alltransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={closeModal}
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable || {}}
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="freelance">Freelance</Select.Option>
              <Select.Option value="stocks">Stocks</Select.Option>
              <Select.Option value="rent">Rent</Select.Option>
              <Select.Option value="utilities">Utilities</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="entertainment">Entertainment</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="miscellaneous">Miscellaneous</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
