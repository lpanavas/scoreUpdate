import React, { useState } from "react";
import "./styles/Demographic.css";
import Select from "react-select";
import countries from "./Countries";

const DemographicCollection = ({
  finishGame,
  setDemographics,
  sendToDemographicData,
  setOutputData,
}) => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [race, setRace] = useState("");
  const [country, setCountry] = useState("");
  const [income, setIncome] = useState("");
  const [tech, setTech] = useState("");
  const [education, setEducation] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    const demographicData = {
      Gender: gender,
      Age: age,
      Race: race,
      Country: country,
      Income: income,
      Tech: tech,
      Education: education,
    };

    setDemographics(demographicData);
    sendToDemographicData.demographics = demographicData;
    setOutputData(sendToDemographicData);

    finishGame();
  };

  const allFieldsFilled = gender && age && race && country && tech && education;
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "60vw",
      marginBottom: "1em",
      fontFamily: "Montserrat",
      borderRadius: "1em",
      margin: ".2em 4vw",
      color: "black",
      fontSize: "calc(.6rem + .7vw)",
    }),
    singleValue: (provided, state) => {
      const textAlign = "left";
      return { ...provided, textAlign };
    },
    option: (provided, state) => ({
      ...provided,
      fontFamily: "Montserrat",
      fontSize: "calc(.6rem + .7vw)",
    }),
    menu: (provided, state) => ({
      ...provided,
      fontFamily: "Montserrat",
      fontSize: "calc(.6rem + .7vw)",
    }),
  };

  const genders = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-binary", label: "Non-binary/ third gender" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  const ages = [
    { value: "", label: "Select Age Range" },
    { value: "<18", label: "Under 18" },
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65+", label: "65+" },
  ];

  const educations = [
    { value: "", label: "Select Education Level" },
    { value: "SomePrimary", label: "Some Primary Education" },
    { value: "CompletedPrimary", label: "Completed Primary" },
    { value: "SomeSecondary", label: "Some Secondary Education" },
    { value: "CompletedSecondary", label: "Completed Secondary" },
    { value: "Vocational", label: "Vocational or Similar" },
    {
      value: "NoDegree",
      label: "Some university but no degree",
    },
    {
      value: "Bachelors",
      label: "University Bachelors degree",
    },
    {
      value: "Graduate",
      label: "Graduate or professional degree (MA, MS, MBA, PhD, JD, MD, DDS)",
    },
    { value: "Prefer", label: "Prefer not to say" },
  ];

  const races = [
    { value: "", label: "Select Ethnicity" },
    { value: "White", label: "White" },
    { value: "Black", label: "Black/African/Caribbean" },
    {
      value: "Asian",
      label:
        "Asian (Indian, Pakistani, Bangladeshi, Chinese, any other Asian background)",
    },
    { value: "Hispanic", label: "Hispanic" },
    { value: "Mixed", label: "Mixed two or more ethnic groups" },
    { value: "Other", label: "Other (Arab or any others)" },
    { value: "Prefer", label: "Prefer not to say" },
  ];

  const techExperience = [
    { value: "", label: "Select Technology Experience" },
    { value: "Course", label: "Taken at least one CS-related course" },
    {
      value: "Undergrad",
      label: "Undergraduate degree in CS or Engineering",
    },
    { value: "Graduate", label: "Graduate degree in CS or Engineering" },
    { value: "Programming", label: "Have programming experience" },
    { value: "None", label: "None of the above experiences" },
  ];

  // Similar arrays for age, education, race, and tech, following the pattern above

  return (
    <div className="demographicQuestions">
      <h2>
        Please fill out the following demographic information to see your
        results. All fields are required:
      </h2>
      <form onSubmit={handleSubmit}>
        <Select
          className="genderSelect"
          styles={customStyles}
          options={genders}
          value={genders.find((obj) => obj.value === gender)}
          onChange={(selectedOption) => setGender(selectedOption.value)}
          isSearchable
        />

        <Select
          className="ageSelect"
          styles={customStyles}
          options={ages}
          value={ages.find((obj) => obj.value === age)}
          onChange={(selectedOption) => setAge(selectedOption.value)}
          isSearchable
        />

        <Select
          className="educationSelect"
          styles={customStyles}
          options={educations}
          value={educations.find((obj) => obj.value === education)}
          onChange={(selectedOption) => setEducation(selectedOption.value)}
          isSearchable
        />

        <Select
          className="raceSelect"
          styles={customStyles}
          options={races}
          value={races.find((obj) => obj.value === race)}
          onChange={(selectedOption) => setRace(selectedOption.value)}
          isSearchable
        />
        <Select
          className="techSelect"
          styles={customStyles}
          options={techExperience}
          value={techExperience.find((option) => option.value === tech)}
          onChange={(selectedOption) => setTech(selectedOption.value)}
          isSearchable
        />

        <Select
          className="countrySelect"
          styles={customStyles}
          options={countries}
          value={countries.find((obj) => obj.value === country)}
          onChange={(selectedOption) => setCountry(selectedOption.value)}
          isSearchable
        />
      </form>
      {allFieldsFilled && (
        <button className="demographicButton" onClick={handleSubmit}>
          See your Results!
        </button>
      )}
    </div>
  );
};

export default DemographicCollection;
