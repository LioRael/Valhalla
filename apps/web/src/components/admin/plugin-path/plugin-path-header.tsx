import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@//components/ui/breadcrumb";

export const PluginPathHeader = () => {
  return (
    <header className="flex h-12 items-center border-b px-2">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin Panel</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Plugin Path</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
