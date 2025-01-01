import '../editorStyles.scss'

import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {forwardRef, useImperativeHandle, useEffect} from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="tiptap-button-group">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
          <img src="/h1.png" alt="h1"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        <img src="/h2.png" alt="h2"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
        <img src="/h3.png" alt="h3"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        <img src="/bold.png" alt="bold"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        <img src="/italic.png" alt="italic"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
        <img src="/underline.png" alt="underline"></img>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
        <img src="/strikethrough.png" alt="strikethrough"></img>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
        <img src="/align-left.png" alt="align-left"></img>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
        <img src="/align-center.png" alt="align-center"></img>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
        <img src="/align-right.png" alt="align-right"></img>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
        <img src="/justify.png" alt="justify"></img>
        </button>
      </div>
    </div>
  )
}

export default forwardRef((props, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: props.initText,
    onUpdate: ({ editor }) => {
      props.handleChange(editor.getHTML()); // Update content state on change
    }
  })

  useImperativeHandle(ref, () => {
    return {
      getText() {
        if (editor) {
          return editor.getHTML();
        }
      },
      focus() {
        editor.commands.focus("end");
      }
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Add an event listener for focus
    editor.view.dom.addEventListener('focus', () => {
      editor.commands.scrollIntoView();
      props.handleFocusChange(props.side, props.index)
    });

    // Cleanup event listener
    return () => {
      editor.view.dom.removeEventListener('focus', () => {
        console.log('Editor focus event cleaned up.');
      });
    };
  }, [editor, props.side, props.index]);

  useEffect(() => {
    if (!editor) return;

    // Add blur event listener
    editor.view.dom.addEventListener('blur', () => {
      props.handleFocusChange(props.side, -1)
    });

    // Cleanup on unmount
    return () => {
      editor.view.dom.removeEventListener('blur', () => {
        console.log('Blur listener removed!');
      });
    };
  }, [editor, props.side, props.index]);

  return (
    <div className="tiptap-div">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
})