"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import valhallaConfig from "@/valhalla";
import {
  FileMeta,
  Resource,
  Template,
  getTemplateByPath,
} from "@sacred-craft/valhalla-resource";
import { ResourceFileProvider } from "@sacred-craft/valhalla-resource-components";

import { useResourceContext } from "../../../layout.client";
import { FilesHeader } from "../../_components/files-header";
import { FilesTabs } from "../../_components/files-tabs";

type FileClientLayoutProps = {
  relativePath: string[];
  type: string;
};

export function FileClientLayout({
  relativePath,
  type,
}: FileClientLayoutProps) {
  const { resource } = useResourceContext();
  const router = useRouter();

  const { data: meta, refetch: refetchMeta } =
    api.files.getResourceFile.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
    });

  if (!meta || meta.type === "dir") {
    return null;
  }

  const template = getTemplateByPath(meta.path, resource, valhallaConfig);

  if (!template) {
    return <div>Template not found</div>;
  }

  const pages = template.options?.render?.map((item) => item.value);

  if (!pages || pages.length === 0) {
    router.push(`/resources/${resource.name}/browser/explore`);
    return null;
  }

  if (pages && !pages.includes(type)) {
    router.push(
      `/resources/${resource.name}/files/${pages[0]}/${relativePath.join("/")}`,
    );
    return null;
  }

  return (
    <ContentLayer
      template={template}
      resource={resource}
      relativePath={relativePath}
      meta={meta}
      refetchMeta={refetchMeta}
      type={type}
    />
  );
}

const ContentLayer = ({
  template,
  resource,
  relativePath,
  meta,
  refetchMeta,
  type,
}: {
  template: Template;
  resource: Resource;
  relativePath: string[];
  meta: FileMeta;
  type: string;
  refetchMeta: () => void;
}) => {
  const { data: content, refetch: refetchContent } =
    api.files.readResourceFile.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
      options: template?.filesOptions?.read as unknown as any,
    });

  const refresh = () => {
    refetchContent();
    refetchMeta();
  };

  const writeResourceFile = api.files.writeResourceFile.useMutation({
    onSuccess: () => {
      refresh();
    },
  });

  const setContent = (
    // eslint-disable-next-line no-undef
    content: string | NodeJS.ArrayBufferView,
    comment?: string,
  ) =>
    writeResourceFile.mutate({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
      content,
      comment,
      options: template?.filesOptions?.write,
    });

  const [contentCache, setContentCache] = useState(content);
  const isModified = content !== contentCache;
  const [leftActions, setLeftActions] = useState<React.ReactNode>(null);
  const [rightActions, setRightActions] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (content) {
      setContentCache(content);
    }
  }, [content]);

  const Component = template.options?.render?.find(
    (item) => item.value === type,
  )?.component;

  const children = Component ? () => <Component /> : null;

  return (
    <ResourceFileProvider
      value={{
        config: valhallaConfig,
        resource,
        template,
        relativePath,
        meta,
        content,
        setContent,
        contentCache,
        setContentCache,
        isModified,
        leftActions,
        setLeftActions,
        rightActions,
        setRightActions,
        refresh,
        refetchMeta,
        refetchContent,
      }}
    >
      <FilesHeader />
      <FilesTabs left={leftActions} right={rightActions} />
      {children && children()}
    </ResourceFileProvider>
  );
};
