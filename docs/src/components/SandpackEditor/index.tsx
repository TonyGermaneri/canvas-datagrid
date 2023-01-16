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
  children,
  dependencies = {},
}: {
  template: SandpackPredefinedTemplate;
  children: JSX.Element,
  dependencies: { [key: string]: string },
  }) => {
  
  return (
    <SandpackProvider
      /* 
      Currently we only support this this template. We might want to add react or vue
      templates at a later stage. 
      */
      template="vanilla-ts" 
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