import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PokemonTypeBadge from '.';

export default {
  component: PokemonTypeBadge,
} as ComponentMeta<typeof PokemonTypeBadge>;

const Template: ComponentStory<typeof PokemonTypeBadge> = (args) => (
  <PokemonTypeBadge {...args} />
);

export const Default = Template.bind({});

Default.args = {
  type: 'fire',
};
