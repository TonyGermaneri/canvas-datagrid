import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

import { createFileMap } from "./createFileMap";

import canvasDatagridPackage from "../../../../package.json"

const version = canvasDatagridPackage.version;

export default ({
  children,
  dependencies = {},
}: {
  children: JSX.Element,
  dependencies: { [key: string]: string },
  }) => {
  
  return (
    <Sandpack
      template="vanilla-ts" // TODO: This should be configurable from the actual sample.
      files={{...createFileMap(children),
        }}
      customSetup={{
        dependencies: {
          ...dependencies,
          "canvas-datagrid": version,
        }
      }}
    />
  );
};