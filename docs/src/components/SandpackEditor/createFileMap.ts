import React from 'react'
import type { SandpackFile } from "@codesandbox/sandpack-react";

export const createFileMap = (
  children: JSX.Element
): Record<string, SandpackFile> => {
  let codeSnippets = React.Children.toArray(children) as React.ReactElement[];

  return codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (codeSnippet.props.mdxType !== "pre") {
        return result;
      }
      const { props } = codeSnippet.props.children;

      const filename = props.metastring ? props.metastring : 'src/index.ts';

      result[filename] = props.children as string;
      
      return result;
    },
    {}
  );
};
