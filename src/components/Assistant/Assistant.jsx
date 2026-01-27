import styles from "./Assistant.module.css";
import { useState, useEffect } from "react";
import OpenAI from "openai";
import { Assistant as OpenAIAssistant } from "../../assistants/openai.js";
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai.js";

const assistantMap = {
  openai: OpenAIAssistant,
  googleai: GoogleAIAssistant,
};

export function Assistant({ onAssistantChange }) {
  const [value, setValue] = useState("openai");

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    const AssistantClass = assistantMap[value];

    if (!AssistantClass) {
      throw new Error(`Unsupported assistant type: ${value}`);
    }

    onAssistantChange(new AssistantClass());
  }, [value]);

  return (
    <div className={styles.Assistant}>
      <span>Assistant:</span>
      <select defaultValue={value} onChange={handleValueChange}>
        <option value="openai">OpenAI</option>
        <option value="googleai">Google AI</option>
      </select>
    </div>
  );
}
