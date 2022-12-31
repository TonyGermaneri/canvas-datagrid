import React from 'react';
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackPredefinedTemplate
} from "@codesandbox/sandpack-react";

import { createFileMap } from "./createFileMap";

import canvasDatagridPackage from "../../../../package.json"

const version = canvasDatagridPackage.version;

export default ({
  template = "vanilla-ts",
  children,
  dependencies = {},
}: {
  template: SandpackPredefinedTemplate;
  children: JSX.Element,
  dependencies: { [key: string]: string },
  }) => {
  
  return (
    <SandpackProvider
      template={template}
      files={{...createFileMap(children),
      }}
      customSetup={{
        dependencies: {
          ...dependencies,
          "canvas-datagrid": version,
        }
      }}
    >
      <SandpackPreview />
      <SandpackCodeEditor />
    </SandpackProvider>
  );
};