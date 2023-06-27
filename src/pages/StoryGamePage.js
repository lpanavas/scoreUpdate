import React, { useEffect, useState } from "react";
import StoryPage from "./StoryPage";
import GamePage from "./GamePage";

function StoryGamePage({ storyPath, finish, prompt, isStory }) {
    const [isFinished, setIsFinished] = useState(false);

    const handleFinish = (chosenOptionIndex, chosenDescriptors) => {
        setIsFinished(true);
        finish(chosenOptionIndex, chosenDescriptors);
    };

    return (
        <div className="appSecond">
            {isStory ? (
                <StoryPage storyPath={storyPath} finishStory={handleFinish} />
            ) : (
                <GamePage
                    gamePath={storyPath}
                    prompt={prompt}
                    finishGame={handleFinish}
                />
            )}
        </div>
    );
}

export default StoryGamePage;
