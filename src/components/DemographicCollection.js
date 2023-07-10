import React, { useState } from "react";
import "./styles/Demographic.css";

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

  const allFieldsFilled =
    gender && age && race && country && income && tech && education;

  return (
    <div>
      <h1>
        Only one more step before you get to see how your results compare to
        everyone else!
      </h1>

      <h2>Please fill out the following demographic information:</h2>
      <form onSubmit={handleSubmit}>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <select value={age} onChange={(e) => setAge(e.target.value)}>
          <option value="">Select Age Range</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55-64">55-64</option>
          <option value="65+">65+</option>
        </select>

        <select value={race} onChange={(e) => setRace(e.target.value)}>
          <option value="">Select Race</option>
          <option value="White">White</option>
          <option value="Black">Black</option>
          <option value="Asian">Asian</option>
          <option value="Other">Other</option>
        </select>

        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          // add other countries here
        </select>

        <select value={income} onChange={(e) => setIncome(e.target.value)}>
          <option value="">Select Income</option>
          <option value="<25,000">25,000</option>
          <option value="25,000-49,999">25,000-49,999</option>
          <option value="50,000-74,999">50,000-74,999</option>
          <option value="75,000-99,999">75,000-99,999</option>
          <option value="100,000+">100,000+</option>
        </select>

        <select value={tech} onChange={(e) => setTech(e.target.value)}>
          <option value="">Select Tech Experience</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
          <option value="">Select Education Level</option>
          <option value="High School">High School</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
        </select>
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
