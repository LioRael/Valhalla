"use server";

import { revalidatePath } from "next/cache";

import fs from "fs";
import path from "path";

import { Plugin } from "@/config/types";
import { setPluginPath } from "@/lib/cookies";

export type File = {
  type: "dir" | "file";
  name: string;
  path: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
};

export async function getFilesByPath(
  path: string[],
): Promise<File[] | undefined> {
  try {
    const mappedFiles = fs
      .readdirSync(path.join("/"))
      .filter((file) => !file.startsWith("."))
      .map(async (file) => {
        const stats = fs.statSync(`${path.join("/")}/${file}`);
        return {
          type: stats.isDirectory() ? "dir" : "file",
          name: file,
          path: `${path.join("/")}/${file}`.split("/"),
          createdAt: stats.birthtime.toLocaleString(),
          updatedAt: stats.mtime.toLocaleString(),
          size: stats.size,
        } as File;
      });

    const files = await Promise.all(mappedFiles);

    return files.sort((a, b) => {
      if (a.type === "dir" && b.type !== "dir") {
        return -1;
      }
      if (a.type !== "dir" && b.type === "dir") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    return undefined;
  }
}

export async function getFile(
  pluginPath: string,
  filePath: string,
): Promise<File & { ext?: string }> {
  const stats = fs.statSync(path.join(pluginPath, filePath));

  return {
    type: stats.isDirectory() ? "dir" : "file",
    name: path.basename(filePath),
    path: filePath.split("/"),
    createdAt: stats.birthtime.toLocaleString(),
    updatedAt: stats.mtime.toLocaleString(),
    size: stats.size,
    ext: path.extname(filePath).slice(1),
  };
}

export async function savePath(formData: FormData) {
  const path = formData.get("path") as string;
  const pluginId = formData.get("pluginId") as string;

  await setPluginPath(pluginId, path);
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function renameFile(oldPath: string, newPath: string) {
  fs.renameSync(oldPath, newPath);
}

export async function saveFile(
  pluginPath: string,
  filePath: string,
  content: string,
) {
  fs.writeFileSync(path.join(pluginPath, filePath), content);
}

export async function revalidateFiles(plugin: Plugin, path: string[]) {
  revalidatePath(`/${plugin.id}/files/${path.join("/")}`);
}
