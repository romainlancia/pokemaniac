import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DebouncedInput from '.';

export default {
  component: DebouncedInput,
} as ComponentMeta<typeof DebouncedInput>;

const Template: ComponentStory<typeof DebouncedInput> = (args) => (
  <DebouncedInput {...args} />
);

export const Default = Template.bind({});

Default.args = {
  label: 'Name',
  value: '',
  placeholder: 'Search by name',
  className: 'p-2 font-lg rounded border border-block',
  onChange: () => null,
};
