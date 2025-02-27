import { Delta, Op } from "quill/core";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";
import Quill, { type QuillOptions } from "quill";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Hint } from "./hint";

import "quill/dist/quill.snow.css";

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
  variant?: "create" | "update";
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write something...",
  deaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisable, setIsToolbarVisable] = useState(true);

  const submitRef = useRef(onSubmit);
  const disabledRef = useRef(disabled);
  const placeholderRef = useRef(placeholder);
  const deaultValueRef = useRef(deaultValue);
  const quillRef = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // TODO Submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
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
        container.innerHTML = "";
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
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisable ? "Hide formatting" : "Show formatting"}
          >
            <Button
              size="iconSm"
              variant="ghost"
              disabled={disabled}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={disabled}
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                size="iconSm"
                variant="ghost"
                disabled={disabled}
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex ite gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {}}
                disabled={disabled || isEmpty}
                className="ml-auto  bg-[#007a5a] hover:[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Button
              size="iconSm"
              disabled={isEmpty || disabled}
              onClick={() => {}}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#007a5a] hover:[#007a5a]/80 text-white"
              )}
            >
              <MdSend className="size-4 " />
            </Button>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
