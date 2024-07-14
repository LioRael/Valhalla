"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useBrowserContext } from "@//app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@//app/(main)/plugins/[plugin]/layout.client";
import { Button } from "@//components/ui/button";
import { FileUploader } from "@//components/ui/file-uploader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@//components/ui/sheet";
import { UploadIcon } from "@radix-ui/react-icons";

export function Upload() {
  const { plugin } = usePluginContext();
  const { relativePath, table } = useBrowserContext();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [files, setFiles] = useState<File[]>([]);

  const [progresses, setProgresses] = useState<Record | undefined>();

  const handleUpload = () => {
    setIsUploading(true);
    let uploadedCount = 0;
    const errors: string[] = [];
    files.forEach((file) => {
      const formData = new FormData();
      formData.append("pluginId", plugin.id);
      formData.append("relativePath", relativePath?.join("/") || "");
      formData.append("files", file);

      const xhr = new XMLHttpRequest();

      // 监听上传进度事件
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgresses((progresses) => {
            const newProgresses = { ...progresses };
            newProgresses[file.name] = percentComplete;
            return newProgresses;
          });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          table?.options.meta?.refresh();
          setProgresses((progresses) => {
            const newProgresses = { ...progresses };
            delete newProgresses[file.name];
            return newProgresses;
          });
          setFiles((files) => {
            return files.filter((f) => f.name !== file.name);
          });
        } else {
          errors.push(file.name);
          toast.error(`Failed to upload file: ${file.name}`);
        }
        uploadedCount++;
        if (uploadedCount === files.length) {
          setIsUploading(false);
          if (errors.length === 0) {
            toast.success("Files uploaded successfully");
          }
        }
      });

      xhr.addEventListener("error", () => {
        toast.error("Failed to upload file");
      });

      xhr.open("POST", "/api/files");
      xhr.send(formData);
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <UploadIcon className="mr-1 h-4 w-4" />
          Upload
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload File</SheetTitle>
          <SheetDescription>
            Upload a file to the current directory.
          </SheetDescription>
        </SheetHeader>
        <div className="grid h-fit gap-4 overflow-scroll py-4">
          <FileUploader
            value={files}
            onValueChange={setFiles}
            multiple
            progresses={progresses}
          />
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button disabled={isUploading} onClick={() => handleUpload()}>
            Upload
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
