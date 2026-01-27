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
  const [value, setValue] = useState("openai:gpt-5-mini");

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
          <option value="openai:gpt-5-mini">GPT-5 Mini</option>
          <option value="openai:gpt-5-nano">GPT-5 Nano</option>
        </optgroup>
        <optgroup label="Google AI">
          <option value="googleai:gemini-3-flash-preview">
            gemini-3-flash-preview
          </option>
          <option value="googleai:gemini-2.5-flash">gemini-2.5-flash</option>
        </optgroup>
      </select>
    </div>
  );
}
