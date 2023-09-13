"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Select from 'react-select';
import { useTupcid } from "@/app/provider";
import axios from "axios";

export default function TestPaper() {
  const {tupcids} = useTupcid();
  const searchparams = useSearchParams();
  const testnumber = searchparams.get('testnumber');
  const testname = searchparams.get('testname');
  const classname = searchparams.get('classname');
  const subjectname = searchparams.get('subjectname');
  const classcode = searchparams.get('classcode');
  const uid = searchparams.get('uid');
  const [savedValues, setSavedValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  

  const questionTypes = [
    { value: 'MultipleChoice', label: 'Multiple Choice' },
    { value: 'TrueFalse', label: 'True/False' },
    { value: 'Identification', label: 'Identification' },
  ];

  const QA = ({ setSavedValues }) => {
    const [fields, setFields] = useState([
      {
        questionType: null,
        question: '',
        answer: '',
        score: '',
        copiedFields: [],
        MCOptions: [
          { label: 'A', text: '' },
          { label: 'B', text: '' },
          { label: 'C', text: '' },
          { label: 'D', text: '' },
        ],
        TFOptions: [
          { label: 'TRUE' },
          { label: 'FALSE' },
        ],
      },
    ]);

    const [fieldTitleNumbers, setFieldTitleNumbers] = useState([1]);

    const [fieldQuestionNumbers, setFieldQuestionNumbers] = useState([1]);

    const addNewField = () => {
      setFields([
        ...fields,
        {
          questionType: null,
          question: '',
          answer: '',
          score: '',
          copiedFields: [],
          MCOptions: [
            { label: 'A', text: '' },
            { label: 'B', text: '' },
            { label: 'C', text: '' },
            { label: 'D', text: '' },
          ],
          TFOptions: [
            { label: 'TRUE' },
            { label: 'FALSE' },
          ],
        },
      ]);
      setFieldTitleNumbers([...fieldTitleNumbers, fieldTitleNumbers.length + 1]);
      setFieldQuestionNumbers([...fieldQuestionNumbers, 1]);
    };

    const alphabeticalOptions = Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    );

    const handleFieldChange = (index, field) => {
      const updatedFields = [...fields];
      updatedFields[index] = field;

      if (field.questionType && field.questionType.value === 'TrueFalse') {
        updatedFields[index].answer = field.answer;
      } else if (field.questionType && field.questionType.value === 'MultipleChoice') {
        updatedFields[index].answer = field.answer;
      } else {
        updatedFields[index].answer = field.answer;
      }
      setFields(updatedFields);
    };

    const addRadioOption = (index) => {
      const updatedFields = [...fields];
      if (!updatedFields[index].MCOptions) {
        updatedFields[index].MCOptions = [];
      }
      if (updatedFields[index].MCOptions.length < 26) {
        const newOption = String.fromCharCode(65 + updatedFields[index].MCOptions.length);
        updatedFields[index].MCOptions.push({ label: newOption, text: '' });
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
      };
      setFields(updatedFields);
    };

    const handleReset = (index, copiedIndex) => {
      const updatedFields = [...fields];
      if (copiedIndex === undefined) {
        updatedFields[index] = { ...fields[index], question: '', answer: '', score: '' };
      } else {
        updatedFields[index].copiedFields[copiedIndex] = {
          ...fields[index].copiedFields[copiedIndex],
          question: '', answer: '', score: '',
        };
      }
      setFields(updatedFields);
    };

    const handleRemoveCopiedField = (fieldIndex, copiedIndex) => {
      const updatedFields = [...fields];
      updatedFields[fieldIndex].copiedFields.splice(copiedIndex, 1);
      setFields(updatedFields);
    };

    const handleQuestionTypeChange = (index, selectedOption) => {
      const updatedFields = [...fields];
      updatedFields[index] = {
        ...fields[index],
        questionType: selectedOption,
        question: '',
        answer: '',
        copiedFields: fields[index].copiedFields.map(() => ({ question: '', answer: '' })),
      };
      setFields(updatedFields);
    };

    // Modify the handleSave function in your frontend code
    const handleSave = async () => {
      const savedData = [];
    
      fields.forEach((field, index) => {
        const questionData = {
          question_type: field.questionType ? field.questionType.value : null,
          question_number: fieldQuestionNumbers[index],
          question: field.question ? field.question.toUpperCase() : '',
          answer: field.answer ? field.answer.toUpperCase() : '',
          total_score: Math.round(parseFloat(field.score) || 0),
        };
    
        savedData.push(questionData);
    
        if (field.copiedFields.length > 0) {
          field.copiedFields.forEach((copiedField, copiedIndex) => {
            const copiedQuestionData = {
              question_type: field.questionType ? field.questionType.value : null,
              question_number: fieldQuestionNumbers[index] + copiedIndex + 1,
              question: copiedField.question ? copiedField.question.toUpperCase() : '',
              answer: copiedField.answer ? copiedField.answer.toUpperCase() : '',
              total_score: Math.round(parseFloat(copiedField.score) || 0), // Use copiedField.score here
            };
    
            savedData.push(copiedQuestionData);
          });
        }
      });
    
      try {
        const response = await axios.post('http://localhost:3001/createtest', {
          TUPCID: tupcids,
          test_name: testname,
          test_number: testnumber,
          class_name: classname,
          class_code: classcode,
          subject_name: subjectname,
          uid: uid,
          data: savedData,
        });
    
        if (response.status === 200) {
          setErrorMessage('Data saved successfully.');
          console.log("response...", response.data)
        } else {
          setErrorMessage('Error saving data. Please try again.');
        }
      } catch (error) {a
        console.error('Error saving data:', error);
        setErrorMessage('Error saving data. Please try again.');
      }
    };
    

    return (
      <div>
        {fields.map((field, index) => (
          <fieldset key={index}>
            <legend>TYPE {fieldTitleNumbers[index]}</legend>

            <Select
              options={questionTypes}
              value={field.questionType}
              onChange={(selectedOption) => handleQuestionTypeChange(index, selectedOption)}
              placeholder="Select Question Type"
            />

            <input
              type="number"
              placeholder="Score per question"
              value={field.score}
              onChange={(e) => handleFieldChange(index, { ...field, score: e.target.value })}
            />
            <div>QUESTION NO. {fieldQuestionNumbers[index]}</div>

            <input
              type="text"
              placeholder="Question"
              value={field.question}
              onChange={(e) => handleFieldChange(index, { ...field, question: e.target.value })}
            />

            {field.questionType && field.questionType.value === 'TrueFalse' ? (
              <div>
                {field.TFOptions.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        value={option.label}
                        checked={field.answer === option.label}
                        onChange={(e) => handleFieldChange(index, { ...field, answer: e.target.value })}
                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : field.questionType && field.questionType.value === 'MultipleChoice' ? (
              <div>
                {field.MCOptions.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        value={option.label}
                        checked={field.answer === option.label}
                        onChange={(e) => handleFieldChange(index, { ...field, answer: e.target.value })}
                      />
                      {option.label}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter text"
                      value={option.text}
                      onChange={(e) => {
                        const updatedFields = [...fields];
                        updatedFields[index].MCOptions[optionIndex].text = e.target.value;
                        setFields(updatedFields);
                      }}
                    />
                  </div>
                ))}
                <button onClick={() => addRadioOption(index)}>Add Radio Option</button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Answer"
                value={field.answer}
                onChange={(e) => handleFieldChange(index, { ...field, answer: e.target.value })}
              />
            )}
            <button onClick={() => handleReset(index)}>Reset</button>

            {field.copiedFields.length > 0 && (
              <div>
                {field.copiedFields.map((copiedField, copiedIndex) => (
                  <div key={copiedIndex} style={{ marginBottom: '10px' }}>
                    <div>QUESTION NO. {fieldQuestionNumbers[index] + copiedIndex + 1}</div>

                    <input
                      type="text"
                      placeholder="Question"
                      value={copiedField.question}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...field,
                          copiedFields: field.copiedFields.map((cf, cIndex) =>
                            cIndex === copiedIndex ? { ...cf, question: e.target.value } : cf
                          ),
                        })
                      }
                    />

                    {field.questionType && field.questionType.value === 'TrueFalse' ? (
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
                                    copiedFields: field.copiedFields.map((cf, cIndex) =>
                                      cIndex === copiedIndex ? { ...cf, answer: e.target.value } : cf
                                    ),
                                  })
                                }
                              />
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : field.questionType && field.questionType.value === 'MultipleChoice' ? (
                      <div>
                        {field.MCOptions.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label>
                              <input
                                type="radio"
                                value={option.label}
                                checked={copiedField.answer === option.label}
                                onChange={(e) =>
                                  handleFieldChange(index, {
                                    ...field,
                                    copiedFields: field.copiedFields.map((cf, cIndex) =>
                                      cIndex === copiedIndex ? { ...cf, answer: e.target.value } : cf
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
                              onChange={(e) => {
                                const updatedFields = [...fields];
                                updatedFields[index].copiedFields[copiedIndex].MCOptions[
                                  optionIndex
                                ].text = e.target.value;
                                setFields(updatedFields);
                              }}
                            />
                          </div>
                        ))}
                        <button onClick={() => addRadioOption(index)}>Add Radio Option</button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Answer"
                        value={copiedField.answer}
                        onChange={(e) =>
                          handleFieldChange(index, {
                            ...field,
                            copiedFields: field.copiedFields.map((cf, cIndex) =>
                              cIndex === copiedIndex ? { ...cf, answer: e.target.value } : cf
                            ),
                          })
                        }
                      />
                    )}

                    <button onClick={() => handleReset(index, copiedIndex)}>Reset</button>
                    <button onClick={() => handleRemoveCopiedField(index, copiedIndex)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {index === fieldTitleNumbers.indexOf(fieldTitleNumbers[index]) && (
              <button onClick={() => handleCopyField(index, field.copiedFields.length)}>Copy Field</button>
            )}
          </fieldset>
        ))}

        <button onClick={addNewField}>Add New Field</button>
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
              pathname: '/Classroom/F/Test',
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
          <a href="/Test/AnswerSheet" className="text-decoration-none link-dark">
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
