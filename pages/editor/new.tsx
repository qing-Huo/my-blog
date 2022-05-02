import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Input, Button } from 'antd'
import styles from './index.module.scss'


const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const NewEditor = () => {
	const [content, setContent] = useState("**Hello world!!!**");
	const [ title, setTitle ] = useState('')

	const handlePublish = () => {

	}

	const handleTitleChange = (event) => {
		setTitle(event.target.value)
	}

	 return (
    <div className={styles.container}>
			<div className={styles.operation}>
				<Input onChange={handleTitleChange} value={title} className={styles.title} placeholder="请输入文章标题" />
				<Button onClick={handlePublish} className={styles.button} type='primary'>发布</Button>
			</div>
      <MDEditor value={content} onChange={setContent} height={1080}/>
    </div>
  )
}

NewEditor.layout = null;

export default NewEditor;
