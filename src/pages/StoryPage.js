import React, { useEffect, useState } from "react";
import Dialogue from "../components/Dialogue";
import Choices from "../components/Choices";
import "../components/styles/StoryPage.css";

function StoryPage({ storyPath, finishStory }) {
  const [storyData, setStoryData] = useState(null);
  const [currentScene, setCurrentScene] = useState("");
  const [dialogues, setDialogues] = useState([]);

  useEffect(() => {
    setStoryData(storyPath);
    setCurrentScene(storyPath.start);
  }, [storyPath]);

  useEffect(() => {
    const scene = storyData?.scenes[currentScene];

    if (scene) {
      setDialogues((oldDialogues) => [
        ...oldDialogues,
        { role: scene.role, text: scene.scene },
      ]);
    }
  }, [storyData, currentScene]);

  const handleChoiceClick = (index) => {
    setDialogues((oldDialogues) => [
      ...oldDialogues,
      { role: "choice", text: scene.choices[index].option },
    ]);
    const nextScene = scene.next;
    if (nextScene.type === "game") {
      finishStory(nextScene.key);
    } else {
      setCurrentScene(nextScene);
    }
  };

  if (!storyData) return "Loading...";

  const scene = storyData.scenes[currentScene];

  return (
    <div className="story-page">
      {dialogues.map((dialogue, index) => (
        <Dialogue key={index} role={dialogue.role} text={dialogue.text} />
      ))}
      {scene && scene.choices && (
        <Choices choices={scene.choices} onClick={handleChoiceClick} />
      )}
    </div>
  );
}

export default StoryPage;
