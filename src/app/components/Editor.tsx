'use client'
import { useCallback, useEffect, useState } from 'react';
import {  convertToRaw, EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextEditor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

const Editor = ({ handlePassText, flag, placeholder = 'محل نوشتن', draftContent, edit = false }: any) => {

	const [contentState, setContentState] = useState<any>('');
	const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());

	const onEditorStateChange = (newEditorState: EditorState) => {
		const html = convertToHTML(newEditorState.getCurrentContent());
		setEditorState(newEditorState);
		handlePassText(html);
	};

	const fetchDraft = useCallback((draft: any) => {
		if (draft) {
 			let _contentState: any = convertFromHTML(draft);
			let raw = convertToRaw(_contentState);
 			setContentState(raw)
		}
	}, [draftContent])

	useEffect(() => {
		edit ? fetchDraft(draftContent) : setEditorState(() => EditorState.createEmpty());
	}, [flag, draftContent])

	return (
		<>
			{edit
				? contentState?.blocks !== undefined && <TextEditor
					toolbarHidden
					defaultContentState={contentState}
					onContentStateChange={setContentState}
					onEditorStateChange={onEditorStateChange}
					wrapperClassName="wrapper-class"
					editorClassName="editor-class"
					toolbarClassName="rich-text__toolbar"
					hashtag={{ separator: ' ', trigger: '#' }}

				/>
				: <TextEditor
					toolbarHidden
					placeholder={placeholder}
					editorState={editorState}
					onEditorStateChange={onEditorStateChange}
					wrapperClassName="wrapper-class"
					editorClassName="editor-class"
					toolbarClassName="rich-text__toolbar"
					hashtag={{ separator: ' ', trigger: '#' }}
				/>}
		</>
	)
}

export default Editor