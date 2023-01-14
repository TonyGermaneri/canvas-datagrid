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
      
      /*
      If no metastring is provided src/index.ts overrides the file in the vanilla-ts template structure.
      If we want to support other templates file paths for these file paths need to be added here.
      */
      const filepath = props.metastring ? `/${props.metastring}` : '/src/index.ts';
      
      result[filepath] = props.children;
      
      return result;
    },
    {}
  );
};
