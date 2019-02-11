

import React, { Component } from 'react';
import { render } from 'react-dom';

import Form from 'react-jsonschema-form-bs4';

const schema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    videoID: { type: 'string', title: 'Vimeo Video ID', default: '314909286/3623e43bae' },
    instructionScreens: {
      type: 'array',
      title: 'Instructions',
      items: {
        type: 'string',
        title: '',
      },
    },
    questions: {
      type: 'array',
      title: 'Questions',
      items: {
        type: 'object',
        title: 'Question',
        properties: {
          type: {
            type: 'string',
            title: 'Type of Question',
            enum: ['mc', 'scale', 'grid', 'open'],
            enumNames: ['Multiple Choice', 'Rating Scale', 'Affect Grid', 'Open Response'],
            default: 'mc',
          },
          label: { type: 'string', title: 'Question Label' },
        },
        dependencies: {
          type: {
            oneOf: [
              {
                properties: {
                  type: {
                    enum: [
                      'mc',
                    ],
                  },
                  choices: {
                    type: 'array',
                    title: 'Answer Choices',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

const log = type => console.log.bind(console, type);

function Configuration() {
  return (
    <Form
      className="configForm"
      schema={schema}
      onChange={log('changed')}
      onSubmit={log('submitted')}
      onError={log('errors')}
    />
  );
}

export default Configuration;
