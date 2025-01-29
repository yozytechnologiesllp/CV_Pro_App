import React, { useState, useCallback } from "react";
import {
  Input,
  Button,
  Card,
  message,
  Skeleton,
  Space,
  Upload,
  Flex,
  Popover,
  Tag,
  Progress,
  Row,
  Col,
  Modal,
} from "antd";
import {
  CloseOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import mammoth from "mammoth";
const { TextArea } = Input;
const { Dragger } = Upload;

const JobDescriptionForm = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingforskills, setLoadingforskills] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [extractSkill, setExtractSkill] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [docText, setDocText] = useState("");

  // Callback to handle file upload with validation
  const handleFileUpload = (file) => {
    const isValidFile = file.size <= 5 * 1024 * 1024; // 5MB limit
    if (!isValidFile) {
      message.error("File size should not exceed 5MB.");
      return false;
    }

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractDocxText(file);
    }

    setResumeFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
    return false;
  };

  // Extract text from DOCX file
  const extractDocxText = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      try {
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setDocText(value || "No text found in this document.");
      } catch (error) {
        console.error("Mammoth Error:", error);
        message.error(
          "Error extracting text from DOCX file. Ensure it's a valid .docx file."
        );
      }
    };

    reader.onerror = () => {
      message.error("Failed to read the document.");
    };

    reader.readAsArrayBuffer(file);
  };

  // Remove uploaded file
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    setPreviewUrl("");
    setDocText(""); // Clear extracted text
  };

  // Analyze the CV and job description
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      return message.warning("Please enter a job description.");
    }
    if (!resumeFile) {
      return message.warning("Please upload your CV.");
    }

    setLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("cv", resumeFile);

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/analyze-cv",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setAnalysisResult(data);
      message.success("Analyzed and results were saved successfully");
    } catch (error) {
      message.error("Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Extract skills from job description
  const handleSkillExtract = async () => {
    if (!jobDescription.trim()) {
      return message.warning("Please enter a job description.");
    }
    setLoadingforskills(true);
    setExtractSkill(null);
    let postdata = {
      jobDescription,
    };
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/extract-skills",
        postdata
      );
      setExtractSkill(data);
    } catch (error) {
      console.log(error);
      message.error("Failed to analyze CV. Please try again.");
    } finally {
      setLoadingforskills(false);
    }
  };

  // Close skills popover
  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  // Skills content
  const renderPopoverContent = () => {
    if (!analysisResult) return null;
    return (
      <div
        style={{
          maxWidth: 400,
          maxHeight: 320,
          overflow: "auto",
          padding: "0 5px",
        }}
      >
        <ul style={{ paddingLeft: 16 }}>
          {analysisResult?.Suggestions?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  };

  const matchedPercentage =
    analysisResult &&
    analysisResult["JD Match"] &&
    analysisResult["JD Match"]?.replaceAll("%", "");

  return (
    <div style={{ padding: 24, maxWidth: "70vw", margin: "auto" }}>
      <Card title="CV Pro App" bordered={false}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <p>Job description</p>
          <TextArea
            rows={5}
            placeholder="Enter job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            allowClear
          />
        </Space>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <p>Share your work - upload your CV</p>
          <Dragger
            accept=".pdf,.docx"
            maxCount={1}
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: "32px" }} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">Supports .pdf, .docx files</p>
            {resumeFile && (
              <div
                style={{
                  marginTop: 8,
                }}
              >
                <Row justify="center" align={"middle"}>
                  <Col>
                    <p style={{ fontWeight: "bold" }}>{resumeFile.name}</p>
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewVisible(true);
                        }}
                        style={{ marginLeft: 8 }}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={handleRemoveFile}
                        style={{ marginLeft: 8 }}
                      />
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
          </Dragger>

          <Flex justify="space-between">
            <Flex>
              <Button
                type="default"
                onClick={handleSkillExtract}
                loading={loadingforskills}
                style={{ marginTop: 16 }}
                disabled={!jobDescription}
              >
                Skill Extract
              </Button>
              {analysisResult && (
                <Popover
                  content={renderPopoverContent()}
                  title={
                    <Flex justify="space-between">
                      <label>Suggestions to improve cv</label>

                      <Button
                        size="small"
                        onClick={handleClosePopover}
                        icon={<CloseOutlined />}
                      ></Button>
                    </Flex>
                  }
                  trigger="click"
                  open={popoverVisible && analysisResult}
                  onOpenChange={(visible) => setPopoverVisible(visible)}
                >
                  <Button
                    type="default"
                    onClick={() => {
                      setPopoverVisible(true);
                    }}
                    style={{
                      marginTop: 16,
                      marginLeft: 10,
                      borderColor: "#1677ff",
                      color: "#1677ff",
                    }}
                  >
                    Show Suggestion
                  </Button>
                </Popover>
              )}
            </Flex>
            <Button
              type="primary"
              onClick={handleAnalyze}
              loading={loading}
              style={{ marginTop: 16 }}
            >
              Submit
            </Button>
          </Flex>
          {loading && <Skeleton active style={{ marginTop: 16 }} />}
          {analysisResult && (
            <Card title="Analysis Result" style={{ marginTop: 16 }}>
              <div className="mb-1">
                <strong>JD Match:</strong>
                <Progress
                  size={38}
                  style={{ marginLeft: 8 }}
                  percent={parseInt(
                    analysisResult["JD Match"]?.replaceAll("%", "") || 0
                  )}
                  type="dashboard"
                  strokeColor={
                    matchedPercentage > 50
                      ? "green"
                      : matchedPercentage <= 20
                      ? "red"
                      : "orange"
                  }
                />
              </div>
              <div style={{ marginTop: 9 }}>
                <strong>Matching Keywords:</strong>{" "}
              </div>
              {analysisResult &&
                analysisResult?.MatchingKeywords?.map((Item, index) => (
                  <Tag color="cyan" key={index} style={{ marginBottom: 5 }}>
                    {Item}
                  </Tag>
                ))}

              <div style={{ marginTop: 9 }}>
                <strong>Missing Keywords:</strong>{" "}
              </div>
              {analysisResult &&
                analysisResult?.MissingKeywords?.map((Item, index) => (
                  <Tag color="red" key={index} style={{ marginBottom: 5 }}>
                    {Item}
                  </Tag>
                ))}

              <div style={{ marginTop: 9 }}>
                <strong>Profile Summary:</strong>{" "}
                {analysisResult["ProfileSummary"] || "No summary available"}
              </div>
            </Card>
          )}
          {extractSkill && (
            <Card title="Extracted Skills" style={{ marginTop: 16 }}>
              <div>
                <strong>Hard Skills:</strong>{" "}
              </div>
              {extractSkill &&
                extractSkill?.hard_skills?.map((Item, index) => (
                  <Tag color="cyan" key={index}>
                    {Item}
                  </Tag>
                ))}

              <div style={{ marginTop: 9 }}>
                <strong>Soft Kills:</strong>{" "}
              </div>
              {extractSkill &&
                extractSkill?.soft_skills?.map((Item, index) => (
                  <Tag color="orange" key={index}>
                    {Item}
                  </Tag>
                ))}
            </Card>
          )}
        </Space>
      </Card>
      <Modal
        title="CV Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={900}
      >
        {resumeFile?.type === "application/pdf" ? (
          <iframe src={previewUrl} width="100%" height="500px" />
        ) : resumeFile?.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              padding: "10px",
              border: "1px solid #ddd",
            }}
          >
            {docText || "Extracting text..."}
          </div>
        ) : (
          <p>Preview is not available for this file type.</p>
        )}
      </Modal>
    </div>
  );
};

export default JobDescriptionForm;
