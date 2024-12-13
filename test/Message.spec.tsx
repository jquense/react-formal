import React from 'react';

import { describe, it, vi, expect } from 'vitest';
import { render } from '@testing-library/react';

import { Form } from '../src';

describe('Message', () => {
  it('should allow empty for', () => {
    let renderSpy = vi.fn((msgs) => {
      expect(msgs).toEqual(['hi', 'good day']);
      return null;
    });
    render(
      <Form noValidate defaultErrors={{ fieldA: 'hi', fieldB: 'good day' }}>
        <div>
          {/* @ts-expect-error */}
          <Form.Message className="msg">{renderSpy}</Form.Message>
        </div>
      </Form>,
    );

    expect(renderSpy).toHaveBeenCalled();
  });

  it('should allow group summaries', () => {
    let renderSpy = vi.fn((msgs) => {
      expect(msgs).toEqual(['foo', 'hi', 'good day']);
      return null;
    });

    render(
      <Form
        noValidate
        defaultErrors={{
          fieldA: ['foo', 'hi'],
          fieldB: 'good day',
          fieldC: 'fooo',
        }}
      >
        <div>
          <Form.Message for={['fieldA', 'fieldB']} className="msg">
            {renderSpy}
          </Form.Message>
        </div>
      </Form>,
    );

    expect(renderSpy).toHaveBeenCalled();
  });
});
