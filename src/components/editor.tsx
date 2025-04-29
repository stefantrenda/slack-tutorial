import Image from 'next/image';
import { Delta, Op } from 'quill/core';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import Quill, { type QuillOptions } from 'quill';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';

import 'quill/dist/quill.snow.css';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  deaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = 'Write something...',
  deaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
}: EditorProps) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisable, setIsToolbarVisable] = useState(true);

  const submitRef = useRef(onSubmit);
  const disabledRef = useRef(disabled);
  const placeholderRef = useRef(placeholder);
  const deaultValueRef = useRef(deaultValue);
  const quillRef = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    disabledRef.current = disabled;
    placeholderRef.current = placeholder;
    deaultValueRef.current = deaultValue;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(deaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisable((current) => !current);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emojiValue);
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisable ? 'Hide formatting' : 'Show formatting'}>
            <Button size="iconSm" variant="ghost" disabled={disabled} onClick={toggleToolbar}>
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button size="iconSm" variant="ghost" disabled={disabled}>
                <Smile className="size-4" />
              </Button>
            </EmojiPopover>
          </Hint>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                size="iconSm"
                variant="ghost"
                disabled={disabled}
                onClick={() => {
                  imageElementRef.current?.click();
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex ite gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={disabled}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image });
                }}
                disabled={disabled || isEmpty}
                className="ml-auto  bg-[#007a5a] hover:[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}

          {variant === 'create' && (
            <Button
              size="iconSm"
              disabled={isEmpty || disabled}
              onClick={() => {
                onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image });
              }}
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:[#007a5a]/80 text-white'
              )}
            >
              <MdSend className="size-4 " />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
            !isEmpty && 'opacity-100'
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
