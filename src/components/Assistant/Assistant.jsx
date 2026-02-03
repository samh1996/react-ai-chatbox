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
  const [value, setValue] = useState("googleai:gemini-1.5-flash");

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    const [assistant, model] = value.split(":");
    const AssistantClass = assistantMap[assistant];

    if (!AssistantClass) {
      throw new Error(`Unsupported assistant type: ${value}`);
    }

    onAssistantChange(new AssistantClass(model));
  }, [value]);

  return (
    <div className={styles.Assistant}>
      <span>Assistant:</span>
      <select defaultValue={value} onChange={handleValueChange}>
        <optgroup label="OpenAI">
          <option value="openai:gpt-4o-mini">GPT-4o Mini</option>
          <option value="openai:gpt-4o">GPT-4o</option>
          <option value="openai:gpt-4">GPT-4</option>
        </optgroup>
        <optgroup label="Google AI">
          <option value="googleai:gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="googleai:gemini-1.5-pro">Gemini 1.5 Pro</option>
        </optgroup>
      </select>
    </div>
  );
}
