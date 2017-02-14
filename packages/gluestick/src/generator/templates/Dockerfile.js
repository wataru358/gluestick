/* @flow */
import type { CreateTemplate } from '../../types';

module.exports = (createTemplate: CreateTemplate, tag: String) => {
  const template = createTemplate`
   # DO NOT MODIFY
   # This file is automatically generated. You can copy this file and add a
   # Dockerfile to the root of the project if you would like to use a custom
   # docker setup.
   FROM truecar/gluestick:${tag}
   ADD . /app
   RUN yarn
   RUN ASSET_URL=__GS_ASSET_URL__ gluestick build
  `;
  return template;
};

