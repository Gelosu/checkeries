"use client";


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { useTupcid } from "@/app/provider";
import axios from "axios";


export default function TestPaper() {
  const { tupcids } = useTupcid();
  const searchparams = useSearchParams();
  const testnumber = searchparams.get("testnumber");
  const testname = searchparams.get("testname");
  const classname = searchparams.get("classname");
  const subjectname = searchparams.get("subjectname");
  const classcode = searchparams.get("classcode");
  const uid = searchparams.get("uid");
  const [savedValues, setSavedValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedFromLocalStorage, setLoadedFromLocalStorage] = useState(false);


  // Load data from localStorage when the component mounts


  const questionTypes = [
    { value: "MultipleChoice", label: "Multiple Choice" },
    { value: "TrueFalse", label: "True/False" },
    { value: "Identification", label: "Identification" },
  ];


  const QA = ({ setSavedValues }) => {
    const [fields, setFields] = useState([
      {
        questionType: questionTypes[0],
        question: "",
        answer: "",
        score: "1",
        copiedFields: [],
        MCOptions: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ],
        TFOptions: [{ label: "TRUE" }, { label: "FALSE" }],
      },
    ]);


    const localStorageKey = `testPaperData_${tupcids}_${classcode}_${uid}`;
   

    useEffect(() => {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        setFields(JSON.parse(savedData));
        setLoadedFromLocalStorage(true);
      }
    }, [localStorageKey]);

      

      const [fieldTitleNumbers, setFieldTitleNumbers] = useState([1]);
      const [fieldQuestionNumbers, setFieldQuestionNumbers] = useState([1]);
  

    const addNewField = () => {


      if (fieldTitleNumbers.length >= 3) {
        return;
      }
 
      let newQuestionType = questionTypes[1]; // Default to True/False
      const hasMultipleChoice = fields.some((field) => field.questionType?.value === "MultipleChoice");
      const hasTrueFalse = fields.some((field) => field.questionType?.value === "TrueFalse");
      if (!hasMultipleChoice) {
        newQuestionType = questionTypes[0];
      } else if (!hasTrueFalse) {
        newQuestionType = questionTypes[1];
      } else {
        newQuestionType = questionTypes[2];
      }
   
      const newFieldNumber = fieldTitleNumbers.length + 1;
      setFields((prevFields) => [
        ...prevFields,
        {
          questionType: newQuestionType,
          question: "",
          answer: "",
          score: "1",
          copiedFields: [],
          MCOptions: [
            { label: "A", text: "" },
            { label: "B", text: "" },
            { label: "C", text: "" },
            { label: "D", text: "" },
          ],
          TFOptions: [{ label: "TRUE" }, { label: "FALSE" }],
        },
      ]);
      setFieldTitleNumbers((prevNumbers) => [...prevNumbers, newFieldNumber]);
      setFieldQuestionNumbers((prevNumbers) => [...prevNumbers, 1]);
    };
   
    const getExistingQuestionTypes = (currentFieldIndex) => {
      const existingTypes = new Set();
 
      fields.forEach((field, index) => {
        if (index !== currentFieldIndex && field.questionType) {
          existingTypes.add(field.questionType.value);
        }
      });
 
      return existingTypes;
    };


    const handleFieldChange = (index, field) => {
      const updatedFields = [...fields];
      updatedFields[index] = field;


      if (field.questionType && field.questionType.value === "TrueFalse") {
        updatedFields[index].answer = field.answer;
      } else if (
        field.questionType &&
        field.questionType.value === "MultipleChoice"
      ) {
        updatedFields[index].answer = field.answer;


        // Update the answer for each option
        updatedFields[index].MCOptions.forEach((option, optionIndex) => {
          if (option.label === field.answer) {
            option.text = field.MCOptions[optionIndex].text;
          }
        });
      } else {
        updatedFields[index].answer = field.answer;
      }
      setFields(updatedFields);
    };


    const addRadioOption = (index, copiedIndex) => {
      const updatedFields = [...fields];
      if (copiedIndex === undefined) {
        if (!updatedFields[index].MCOptions) {
          updatedFields[index].MCOptions = [];
        }
        if (updatedFields[index].MCOptions.length < 26) {
          const newOption = String.fromCharCode(
            65 + updatedFields[index].MCOptions.length
          );
          updatedFields[index].MCOptions.push({ label: newOption, text: "" });
          setFields(updatedFields);
        }
      } else {
        if (!updatedFields[index].copiedFields[copiedIndex].MCOptions) {
          updatedFields[index].copiedFields[copiedIndex].MCOptions = [];
        }
        if (
          updatedFields[index].copiedFields[copiedIndex].MCOptions.length < 26
        ) {
          const newOption = String.fromCharCode(
            65 + updatedFields[index].copiedFields[copiedIndex].MCOptions.length
          );
          updatedFields[index].copiedFields[copiedIndex].MCOptions.push({
            label: newOption,
            text: "",
          });
          setFields(updatedFields);
        }
      }
    };


    const subtractRadioOption = (index, copiedIndex) => {
      const updatedFields = [...fields];


      if (copiedIndex === undefined) {
        // Subtract an option from the original field
        if (updatedFields[index].MCOptions.length > 4) {
          updatedFields[index].MCOptions.pop();
        } else {
          console.error(
            "Cannot subtract option. Minimum of 4 options required."
          );
        }
      } else if (
        updatedFields[index].copiedFields &&
        updatedFields[index].copiedFields[copiedIndex].MCOptions
      ) {
        // Subtract an option from a copied field
        if (
          updatedFields[index].copiedFields[copiedIndex].MCOptions.length > 4
        ) {
          updatedFields[index].copiedFields[copiedIndex].MCOptions.pop();
        } else {
          console.error(
            "Cannot subtract option. Minimum of 4 options required."
          );
        }
      }


      setFields(updatedFields);
    };


    const handleOptionTextChange = (index, optionIndex, text) => {
      const updatedFields = [...fields];
      if (
        updatedFields[index].MCOptions &&
        updatedFields[index].MCOptions[optionIndex]
      ) {
        updatedFields[index].MCOptions[optionIndex].text = text;
        setFields(updatedFields);
      }
    };


    const handleOptionTextChangeForCopiedField = (
      index,
      copiedIndex,
      optionIndex,
      text
    ) => {
      const updatedFields = [...fields];
      if (
        updatedFields[index].copiedFields[copiedIndex].MCOptions &&
        updatedFields[index].copiedFields[copiedIndex].MCOptions[optionIndex]
      ) {
        updatedFields[index].copiedFields[copiedIndex].MCOptions[
          optionIndex
        ].text = text;
        setFields(updatedFields);
      }
    };


    const handleCopyField = (index, copiedIndex) => {
      const copiedField = { ...fields[index].copiedFields[copiedIndex] };
      const updatedFields = [...fields];
      if (!updatedFields[index].copiedFields) {
        updatedFields[index].copiedFields = [];
      }
      updatedFields[index].copiedFields[copiedIndex] = {
        ...fields[index].copiedFields[copiedIndex],
        copiedFields: [...(copiedField.copiedFields || [])],
        MCOptions: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ], // Initialize MCOptions with default values
      };


      if (
        fields[index].questionType &&
        fields[index].questionType.value === "MultipleChoice"
      ) {
        updatedFields[index].copiedFields[copiedIndex].answer =
          copiedField.answer;
      }


      setFields(updatedFields);
    };


    const handleCopyFieldData = (index, copiedIndex) => {
  const updatedFields = [...fields];

  if (!updatedFields[index].copiedFields) {
    updatedFields[index].copiedFields = [];
  }

  const sourceQuestion = copiedIndex === undefined ? updatedFields[index] : updatedFields[index].copiedFields[copiedIndex];

  const copiedData = {
    questionType: sourceQuestion.questionType,
    question: sourceQuestion.question,
    answer: sourceQuestion.answer,
    score: sourceQuestion.score,
    MCOptions: sourceQuestion.MCOptions.map(option => ({ ...option })), // Deep copy MCOptions
    TFOptions: sourceQuestion.TFOptions.map(option => ({ ...option })), // Deep copy TFOptions
  };

  if (copiedIndex === undefined) {
    updatedFields[index].copiedFields.splice(index, 0, copiedData);
  } else {
    updatedFields[index].copiedFields.splice(copiedIndex + 1, 0, copiedData);
  }

  setFields(updatedFields);
};


    const handleReset = (index, copiedIndex) => {
      const updatedFields = [...fields];
      if (copiedIndex === undefined) {
        updatedFields[index] = {
          ...fields[index],
          question: "",
          answer: "",
          MCOptions: fields[index].MCOptions.map((option) => ({
            ...option,
            text: "", // Reset text for MultipleChoice options
          })),
        };
      } else {
        updatedFields[index].copiedFields[copiedIndex] = {
          ...fields[index].copiedFields[copiedIndex],
          question: "",
          answer: "",
          MCOptions: fields[index].copiedFields[copiedIndex].MCOptions.map(
            (option) => ({
              ...option,
              text: "", // Reset text for MultipleChoice options
            })
          ),
        };
      }
      setFields(updatedFields);
    };


    const handleRemoveCopiedField = (fieldIndex, copiedIndex) => {
      const updatedFields = [...fields];
      updatedFields[fieldIndex].copiedFields.splice(copiedIndex, 1);
      setFields(updatedFields);
    };


    const handleRemoveField = (index) => {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);


      // Update the TYPE numbers for the remaining fields
      const updatedFieldTitleNumbers = updatedFields.map(
        (field, i) => fieldTitleNumbers[i]
      );
      const updatedFieldQuestionNumbers = updatedFields.map(
        (field, i) => fieldQuestionNumbers[i]
      );


      setFields(updatedFields);
      setFieldTitleNumbers(updatedFieldTitleNumbers);
      setFieldQuestionNumbers(updatedFieldQuestionNumbers);
    };


    const handleQuestionTypeChange = (index, selectedOption) => {
      const updatedFields = [...fields];
      updatedFields[index] = {
        questionType: selectedOption,
        question: "",
        answer: "",
        score: "1",
        copiedFields: [],
        MCOptions: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ],
        TFOptions: [{ label: "TRUE" }, { label: "FALSE" }],
      };
      setFields(updatedFields);
    };


    const handleSave = async () => {
      const localStorageKey = `testPaperData_${tupcids}_${classcode}_${uid}`;
  const savedData = JSON.parse(localStorage.getItem(localStorageKey) || '[]'); // Load existing data from local storage or initialize as an empty array

  const typeScores = {};
  localStorage.setItem(localStorageKey, JSON.stringify(fields));

      const updatedSavedValues = [];


      fields.forEach((field, index) => {
        const question = field.question ? field.question.trim() : "";
        const questionWithQuestionMark = question.endsWith("?")
          ? question
          : question + "?";


        const questionData = {
          type: `TYPE ${fieldTitleNumbers[index]}`,
          score: Math.round(parseFloat(field.score) || 0),
          questionType: field.questionType ? field.questionType.value : null,
          questionNumber: fieldQuestionNumbers[index],
          question: questionWithQuestionMark.toUpperCase(),
          answer: field.answer ? field.answer.toUpperCase() : "",
        };


        if (
          field.questionType &&
          field.questionType.value === "MultipleChoice"
        ) {
          questionData.options = field.MCOptions.map((option) => ({
            label: option.label,
            text: option.text ? option.text.toUpperCase() : "",
          }));
        }


        updatedSavedValues.push(questionData);


        if (field.copiedFields.length > 0) {
          field.copiedFields.forEach((copiedField, copiedIndex) => {
            const question = copiedField.question
              ? copiedField.question.trim()
              : "";
            const questionWithQuestionMark = question.endsWith("?")
              ? question
              : question + "?";


            const copiedQuestionData = {
              type: `TYPE ${fieldTitleNumbers[index]}`,
              score: Math.round(parseFloat(field.score) || 0),
              questionType: field.questionType
                ? field.questionType.value
                : null,
              questionNumber: fieldQuestionNumbers[index] + copiedIndex + 1,
              question: questionWithQuestionMark.toUpperCase(),
              answer: copiedField.answer
                ? copiedField.answer.toUpperCase()
                : "",
            };


            if (
              field.questionType &&
              field.questionType.value === "MultipleChoice"
            ) {
              // Save all radio button options and their text for copied fields
              copiedQuestionData.options = copiedField.MCOptions.map(
                (option) => ({
                  label: option.label,
                  text: option.text ? option.text.toUpperCase() : "",
                })
              );
            }


            updatedSavedValues.push(copiedQuestionData);
          });
        }
      });


      savedData.forEach((data) => {
        const type = data.type;
        if (typeScores[type]) {
          typeScores[type] += data.score;
        } else {
          typeScores[type] = data.score;
        }
      });


      const totalScore = updatedSavedValues.reduce(
        (total, data) => total + data.score,
        0
      );
      typeScores["Total Score"] = totalScore;
      updatedSavedValues.push(typeScores);


      setSavedValues(updatedSavedValues);


      try {
        console.log("DATA SENDING....", updatedSavedValues);
      
        if (savedData.length > 0) {
          // Data already exists, perform a PUT request to update it in the testpaper table
          const response1 = await axios.put(
            `http://localhost:3001/updatetestpaper/${tupcids}/${classcode}/${uid}`,
            {
              data: updatedSavedValues,
            }
          );
      
          if (response1.status === 200) {
            setErrorMessage("Data updated successfully.");
          } else {
            setErrorMessage("Error updating data. Please try again.");
          }
      
          // Update data in the preset and testforstudents tables
          const response2 = await axios.put(
            `http://localhost:3001/updatetestpaperinpresetandtestpaper/${tupcids}/${classcode}/${testname}/${testnumber}`,
            {
              data: updatedSavedValues,
            }
          );
      
          if (response2.status === 200) {
            setErrorMessage("Data updated successfully.");
          } else {
            setErrorMessage("Error updating data. Please try again.");
          }
        } else {
          // If no data exists, perform a POST request to create new data
          const response = await axios.post("http://localhost:3001/createtestpaper", {
            TUPCID: tupcids,
            test_name: testname,
            test_number: testnumber,
            class_name: classname,
            class_code: classcode,
            subject_name: subjectname,
            uid: uid,
            data: updatedSavedValues,
          });
      
          if (response.status === 200) {
            setErrorMessage("Data saved successfully.");
          } else {
            setErrorMessage("Error saving data. Please try again.");
          }
      
          // Also update data in the preset and testpaper tables
          const response2 = await axios.put(
            `http://localhost:3001/updatetestpaperinpresetandtestpaper/${tupcids}/${classcode}/${testname}/${testnumber}`,
            {
              data: updatedSavedValues,
            }
          );
      
          if (response2.status === 200) {
            setErrorMessage("Data updated successfully.");
          } else {
            setErrorMessage("Error updating data. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error saving/updating data:", error);
        setErrorMessage("Error saving/updating data. Please try again.");
      }
      
    };

    return (
      <div className="d-flex flex-column justify-content-center align-items-center container-sm col-lg-8 col-11 border border-dark rounded py-2">
        {fields.map((field, index) => (
          <fieldset
            className="row col-lg-9 col-11 justify-content-center"
            key={index}
          >
            <legend className="p-0">TYPE {fieldTitleNumbers[index]}</legend>
            <div className="row align-items-center p-0">
              <span className="col-2 p-0 ">TYPE OF TEST:</span>
              <Select
                className="col-8"
                options={questionTypes.filter(
                  (option) =>
                    !getExistingQuestionTypes(index).has(option.value)
                )}
                value={field.questionType}
                onChange={(selectedOption) =>
                  handleQuestionTypeChange(index, selectedOption)
                }
                placeholder="Select Question Type"
              />


              <input
                className="col-2 py-1 rounded border border-dark"
                type="number"
                placeholder="Score per question"
                value={field.score}
                onChange={(e) =>
                  handleFieldChange(index, { ...field, score: e.target.value })
                }
              />
            </div>


            <div className="col-12 p-0">
              <div>QUESTION NO. {fieldQuestionNumbers[index]}</div>
            </div>
            <div className="row p-0 mb-1"></div>
            <input
              className="col-12 border border-dark rounded py-1 px-3 mb-1"
              type="text"
              placeholder="Question"
              value={field.question}
              onChange={(e) =>
                handleFieldChange(index, { ...field, question: e.target.value })
              }
            />


            {field.questionType && field.questionType.value === "TrueFalse" ? (
              <div className="p-0">
                {field.TFOptions.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        value={option.label}
                        checked={field.answer === option.label}
                        onChange={(e) =>
                          handleFieldChange(index, {
                            ...field,
                            answer: e.target.value,
                          })
                        }
                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : field.questionType &&
              field.questionType.value === "MultipleChoice" ? (
              <div>
                {field.MCOptions.map((option, optionIndex) => (
                  <div key={optionIndex} className="mb-1">
                    <label className="col-1">
                      <input
                        type="radio"
                        value={option.label}
                        checked={field.answer === option.label}
                        onChange={(e) =>
                          handleFieldChange(index, {
                            ...field,
                            answer: e.target.value,
                          })
                        }
                      />
                      {option.label}
                    </label>
                    <input
                      className="border border-dark rounded py-1 px-3"
                      type="text"
                      placeholder="Enter text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(
                          index,
                          optionIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={() => addRadioOption(index)}
                  className="border border-dark rounded py-1 px-3"
                >
                  + Option
                </button>
                <button
                  onClick={() => subtractRadioOption(index)}
                  className="border border-dark rounded py-1 px-3"
                >
                  - Option
                </button>
              </div>
            ) : (
              <div className="p-0">
                <input
                  className="col-12 border border-dark rounded mb-1 py-1 px-3"
                  type="text"
                  placeholder="Answer"
                  value={field.answer}
                  onChange={(e) =>
                    handleFieldChange(index, {
                      ...field,
                      answer: e.target.value,
                    })
                  }
                />
              </div>
            )}
            <button
              className="border border-dark rounded col-1"
              onClick={() => handleReset(index)}
            >
              <img
                src="/reset.svg"
                alt="reset"
                height={20}
                width={20}
                className="pb-1"
              />
            </button>
            <br />
            <button onClick={() => handleCopyFieldData(index)}>Copy</button>


            {/* for copyfield as sub field */}


            {field.copiedFields.length > 0 && (
              <div className="p-0 row justify-content-center">
                {field.copiedFields.map((copiedField, copiedIndex) => (
                  <div
                    className="p-0 col-12"
                    key={copiedIndex}
                    style={{ marginBottom: "10px" }}
                  >
                    <div>
                      QUESTION NO.{" "}
                      {fieldQuestionNumbers[index] + copiedIndex + 1}
                    </div>


                    <div className="p-0 mb-1">
                      <input
                        className="col-10 border border-dark rounded px-3 py-1"
                        type="text"
                        placeholder="Question"
                        value={copiedField.question}
                        onChange={(e) =>
                          handleFieldChange(index, {
                            ...field,
                            copiedFields: field.copiedFields.map((cf, cIndex) =>
                              cIndex === copiedIndex
                                ? { ...cf, question: e.target.value }
                                : cf
                            ),
                          })
                        }
                      />
                    </div>


                    {field.questionType &&
                    field.questionType.value === "TrueFalse" ? (
                      <div>
                        {field.TFOptions.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label>
                              <input
                                type="radio"
                                value={option.label}
                                checked={copiedField.answer === option.label}
                                onChange={(e) =>
                                  handleFieldChange(index, {
                                    ...field,
                                    copiedFields: field.copiedFields.map(
                                      (cf, cIndex) =>
                                        cIndex === copiedIndex
                                          ? { ...cf, answer: e.target.value }
                                          : cf
                                    ),
                                  })
                                }
                              />
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : field.questionType &&
                      field.questionType.value === "MultipleChoice" ? (
                      <div>
                        {copiedField.MCOptions.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label>
                              <input
                                type="radio"
                                value={option.label}
                                checked={copiedField.answer === option.label}
                                onChange={(e) =>
                                  handleFieldChange(index, {
                                    ...field,
                                    copiedFields: field.copiedFields.map(
                                      (cf, cIndex) =>
                                        cIndex === copiedIndex
                                          ? { ...cf, answer: e.target.value }
                                          : cf
                                    ),
                                  })
                                }
                              />
                              {option.label}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter text"
                              value={option.text}
                              onChange={(e) =>
                                handleOptionTextChangeForCopiedField(
                                  index,
                                  copiedIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addRadioOption(index, copiedIndex)}
                        >
                          + Option
                        </button>
                        <button
                          onClick={() =>
                            subtractRadioOption(index, copiedIndex)
                          }
                        >
                          - Option
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          className="border border-dark rounded col-12 px-3 py-1"
                          type="text"
                          placeholder="Answer"
                          value={copiedField.answer}
                          onChange={(e) =>
                            handleFieldChange(index, {
                              ...field,
                              copiedFields: field.copiedFields.map(
                                (cf, cIndex) =>
                                  cIndex === copiedIndex
                                    ? { ...cf, answer: e.target.value }
                                    : cf
                              ),
                            })
                          }
                        />
                      </div>
                    )}


                    <button
                      className="col-1 border border-dark rounded py-1"
                      onClick={() => handleReset(index, copiedIndex)}
                    >
                      <img
                        src="/reset.svg"
                        alt="reset"
                        height={20}
                        width={20}
                        className="pb-1"
                      />
                    </button>
                    <br />
                    <button
                      className="col-1 border border-dark rounded py-1"
                      onClick={() =>
                        handleRemoveCopiedField(index, copiedIndex)
                      }
                    >
                      <span className="p-2">-</span>
                    </button>
                    <br />
                    <button
                      onClick={() => handleCopyFieldData(index, copiedIndex)}
                    >
                      Copy
                    </button>
                    <br />
                  </div>
                ))}
              </div>
            )}
            <div>
              <br />
              <button
                onClick={() =>
                  handleCopyField(index, field.copiedFields.length)
                }
              >
                Copy Empty Field
              </button>
              <br />


              <button onClick={() => handleRemoveField(index)}>
                Remove Field
              </button>
            </div>
          </fieldset>
        ))}


        <button onClick={addNewField}>Add New Field</button>
        <br />
        <button onClick={handleSave}>Save All</button>
      </div>
    );
  };


  return (
    <main className="container-fluid p-sm-4 py-3 h-100">
      <section>
        <div className="d-flex ">
          <Link
            href={{
              pathname: "/Classroom/F/Test",
              query: {
                classname: classname,
                classcode: classcode,
                subjectname: subjectname,
              },
            }}
          >
            <img src="/back-arrow.svg" height={30} width={40} />
          </Link>
          &nbsp;
          <h3 className="m-0">
            {testnumber}:{testname}
          </h3>
        </div>
        <ul className="d-flex flex-wrap justify-content-around mt-3 list-unstyled">
          <li className="m-0 fs-5 text-decoration-underline">TEST PAPER</li>
          <a
            href="/Test/AnswerSheet"
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">ANSWER SHEET</li>
          </a>
          <a href="/Test/AnswerKey" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">ANSWER KEY</li>
          </a>
          <a href="/Test/Records" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">RECORDS</li>
          </a>
        </ul>
        <QA setSavedValues={setSavedValues} />
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
      </section>
    </main>
  );
}





