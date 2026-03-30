import styles from './AiPanel.module.css'
import { useState } from 'react';
import InputText from '../../UI/InputFields/InputText';

function AiPanel() {
const [prompt, setPrompt] = useState("")
const handleAddPrompt = {
    
}
    return (

        <div className={styles.AiPanel}>
        <h1>Hailey AI</h1>
            <InputText
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleAddPrompt}
              placeholder="What do you think will happn next?"
              disabled={false}
            />
        </div>
    )
}

export default AiPanel;
